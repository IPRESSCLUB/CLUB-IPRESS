"""Authored architectural geometry, measured against the supplied IFMEREE photos.
No bitmap tracing, raster layers, random edge extraction, or runtime dependencies.
Run with Python + fontTools; generated SVGs are the editable, standalone sources.
"""
from pathlib import Path
import math, html
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.perimeterPen import PerimeterPen
from fontTools.svgLib.path import parse_path

ROOT=Path(__file__).parent
FONT=TTFont(ROOT/'space-bold.ttf'); GLYPHS=FONT.getGlyphSet(); CMAP=FONT.getBestCmap()
INK='#25302b'; MID='#707971'; PALE='#eef0e9'; BLUE='#244bd8'; GREEN='#b8dd70'
def n(x): return str(round(x,2)).rstrip('0').rstrip('.') if isinstance(x,float) else str(x)
def points(ps): return ' '.join(f'{n(x)},{n(y)}' for x,y in ps)
def line(ps,close=False): return 'M'+' L'.join(f'{n(x)} {n(y)}' for x,y in ps)+(' Z' if close else '')
def mix(a,b,t): return (a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)
def quad(q,u,v): return mix(mix(q[0],q[1],u),mix(q[3],q[2],u),v)
def shape(q,u0,v0,u1,v1): return [quad(q,u0,v0),quad(q,u1,v0),quad(q,u1,v1),quad(q,u0,v1)]

class PaintList(list):
    """Keep painter's order: foreground walls/leaves occlude earlier linework."""
    def __init__(self,scene,kind):
        super().__init__();self.scene=scene;self.kind=kind
    def append(self,item):
        super().append(item);self.scene.layers.append((self.kind,item))

class Scene:
    def __init__(self,key,viewbox,title,description):
        self.key=key;self.viewbox=viewbox;self.title=title;self.description=description
        self.layers=[]
        self.base=PaintList(self,'paper');self.render=PaintList(self,'render');self.ink=PaintList(self,'lines')
        self.accents=[];self.defs=[];self.count=0
        self.times={'structure':(.02,.30),'openings':(.20,.57),'screens':(.39,.76),'lettering':(.44,.76),'landscape':(.28,.85),'material':(.56,.94),'shadow':(.77,1)}
        self.counts={k:0 for k in self.times}
    def draw(self,d,kind='structure',width=1.5,color=INK,fill='none',attrs='',duration=None):
        a,b=self.times[kind];idx=self.counts[kind];self.counts[kind]+=1
        # Geometric families overlap; a repeated element begins 30–80ms after its neighbour.
        offset=(idx%12)*.007
        start=min(a+offset,b-.13);end=min(b+offset,1)
        if duration:end=min(1,start+duration)
        record=RecordingPen();parse_path(d,record);lengths=[];pen=None
        for op,args in record.value:
            if op=='moveTo':
                if pen:lengths.append(pen.value)
                pen=PerimeterPen(None,tolerance=.01)
            getattr(pen,op)(*args)
        if pen:lengths.append(pen.value)
        # Compound paths draw every intentional subpath over the full phase,
        # rather than waiting until the final few percent of an oversized dash.
        span=max(lengths)/max(1e-9,sum(lengths))
        self.ink.append(f'<path class="ifm-vector-stroke" data-family="{kind}" data-from="{start:.3f}" data-to="{end:.3f}" data-span="{span:.5f}" pathLength="1" d="{d}" fill="{fill}" stroke="{color}" stroke-width="{width}" {attrs}/>')
    def surface(self,q,tone='#f1f2ed',kind='structure',hatch=False,outline=True,width=1.6):
        d=line(q,True)
        self.base.append(f'<path d="{d}" fill="#fff"/>')
        self.render.append(f'<path d="{d}" fill="{tone}"/>')
        if hatch:self.render.append(f'<path d="{d}" fill="url(#{self.key}-hatch)" opacity=".45"/>')
        if outline:self.draw(d,kind,width)
    def patch(self,q,color=INK,opacity=.12):
        self.render.append(f'<path d="{line(q,True)}" fill="{color}" opacity="{opacity}"/>')
    def shade_lines(self,d,width=.65,color=MID):
        self.render.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}"/>')
    def detail(self,d,width=.7,color=MID,kind='material'):
        self.draw(d,kind,width,color)
    def window(self,q,cols=3,rows=2,awnings=(),dark=False):
        self.surface(q,'#d8dfdb' if not dark else '#9ca9a1','openings',width=2.1)
        inner=shape(q,.035,.045,.965,.955)
        self.draw(line(inner,True),'openings',.9)
        for c in range(1,cols):
            u=c/cols;self.draw(line([quad(q,u,0),quad(q,u,1)]),'openings',1.45)
        for r in range(1,rows):
            v=r/rows;self.draw(line([quad(q,0,v),quad(q,1,v)]),'openings',1.3)
        for c in range(cols):
            self.patch(shape(q,(c+.04)/cols,.055,(c+.18)/cols,.93),'#fff',.5)
        self.patch([quad(q,0,0),quad(q,1,0),quad(q,.65,.29),quad(q,0,.51)],INK,.12)
        for c in awnings:
            # Actual projecting, outward-opening sash: same four corners in all states.
            a=quad(q,c/cols+.025,.35);b=quad(q,(c+1)/cols-.025,.35)
            c2=quad(q,(c+1)/cols-.06,.79);d=quad(q,c/cols-.045,.79)
            self.surface([a,b,c2,d],'#eef0eb','openings',hatch=True,width=1.2)
            self.patch([c2,d,(d[0]+10,d[1]+9),(c2[0]+8,c2[1]+5)],INK,.55)
            self.draw(line([a,d,c2,b]),'openings',1.3)
    def screen(self,q,cols,rows):
        self.surface(q,'#fafbf7','screens',width=1.7)
        self.draw(line(shape(q,.035,.03,.965,.97),True),'screens',.8)
        motifs=[[(.12,.18),(.80,.18),(.80,.45),(.38,.45),(.38,.78),(.88,.78)],
                [(.16,.12),(.16,.80),(.45,.80),(.45,.43),(.83,.43),(.83,.86)],
                [(.12,.22),(.55,.22),(.55,.76),(.85,.76),(.85,.12)],
                [(.15,.15),(.15,.47),(.78,.47),(.78,.80),(.20,.80)]]
        # Draw each coherent row as one path, rather than dozens of unrelated pixels.
        for row in range(rows):
            ds=[]
            for col in range(cols):
                m=motifs[(row+col*2)%4]
                ps=[quad(q,.06+.88*(col+x)/cols,.04+.92*(row+y)/rows) for x,y in m]
                ds.append(line(ps))
            self.draw(' '.join(ds),'screens',max(2.3,math.dist(q[0],q[1])/cols*.18),INK,attrs='stroke-linecap="square" stroke-linejoin="miter"')
    def lettering(self,text,x,y,width,height,slant=0,color=INK,kind='lettering'):
        names=[CMAP[ord(c)] for c in text];adv=sum(GLYPHS[g].width for g in names)
        cap=FONT['OS/2'].sCapHeight; sx=width/adv;sy=height/cap;cursor=0
        for name in names:
            pen=SVGPathPen(GLYPHS)
            # Photo-aligned baseline. x advances normally; y follows the façade perspective.
            trans=TransformPen(pen,(sx,slant*sx,0,-sy,x+cursor*sx,y+cursor*sx*slant))
            GLYPHS[name].draw(trans);d=pen.getCommands()
            if d:
                self.base.append(f'<path d="{d}" fill="#fff"/>')
                self.render.append(f'<path d="{d}" fill="{color}"/>')
                self.draw(d,kind,.8,INK)
            cursor+=GLYPHS[name].width
    def palm(self,x,ground,height,spread,phase=0):
        crown=(x-8,height and ground-height);cx,cy=crown
        trunk=[(x-11,ground),(x+11,ground),(cx+6,cy),(cx-6,cy)]
        self.surface(trunk,'#a7aea1','landscape',hatch=True,width=1.25)
        ds=[]
        for k in range(int(height/13)):
            t=k/max(1,int(height/13));p=mix((x,ground),(cx,cy),t);w=10-4*t
            ds.append(f'M{n(p[0]-w)} {n(p[1])}l{n(w)} 4 {n(w)} -5')
        self.detail(' '.join(ds),.7,INK,'landscape')
        for j in range(23):
            angle=math.radians(-187+j*8.7+phase)
            length=spread*(.85+.15*math.cos(j*1.7))
            tip=(cx+math.cos(angle)*length,cy+math.sin(angle)*length*.98)
            mid=((cx+tip[0])/2,cy+(tip[1]-cy)*.65-7)
            delta=length*.11
            d=f'M{n(cx)} {n(cy)} Q{n(mid[0])} {n(mid[1]-delta)} {n(tip[0])} {n(tip[1])} Q{n(mid[0])} {n(mid[1]+delta)} {n(cx)} {n(cy)}Z'
            self.base.append(f'<path d="{d}" fill="#fff"/>')
            self.render.append(f'<path d="{d}" fill="{["#bac7ac","#77816e","#d6ddcc"][j%3]}"/>')
            self.draw(d,'landscape',.8)
            vein=f'M{n(cx)} {n(cy)}Q{n(mid[0])} {n(mid[1])} {n(tip[0])} {n(tip[1])}'
            self.draw(vein,'landscape',.65,INK)
            ribs=[]
            for k in range(3,9):
                t=k/10;a=mix((cx,cy),tip,t);off=delta*math.sin(t*math.pi)
                ribs.append(line([(a[0]-off*.35,a[1]+off),(a[0],a[1]-2),(a[0]+off*.35,a[1]-off)]))
            self.shade_lines(' '.join(ribs),.48,'#4b5e45')
        # The lower drooping leaves use the same botanical vocabulary.
        for side in (-1,1):
            self.draw(f'M{cx} {cy}Q{cx+side*spread*.65} {cy-12} {cx+side*spread*.78} {cy+spread*.35} M{cx} {cy}Q{cx+side*spread*.5} {cy+10} {cx+side*spread*.53} {cy+spread*.52}','landscape',1.1)
    def hedge(self,a,b,count=14,scale=1):
        outline=[];leaves=[]
        for k in range(count):
            x,y=mix(a,b,(k+.5)/count);h=(7+(k%3)*2)*scale;w=8*scale
            outline.append(f'M{n(x-w)} {n(y)}q{-w/2} {-h} {w/2} {-h*.8}q0 {-h} {w*.7} {-h*.7}q{w} {-h*.6} {w*.8} {h*.4}q{w} 0 {w/2} {h}q{-w/4} {h/2} {-w} {h*.3}')
            leaves.append(f'M{n(x)} {n(y)}l-3 {-h}m3 {h}l6 {-h*.8}')
        self.draw(' '.join(outline),'landscape',.75,MID)
        self.shade_lines(' '.join(leaves),1.1,'#667b55')
    def svg(self):
        k=self.key;v=self.viewbox
        defs=f'''<defs>
          <pattern id="{k}-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)"><path d="M0 0V7" stroke="#687266" stroke-width=".6"/></pattern>
          <pattern id="{k}-concrete" width="29" height="25" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r=".65" fill="#a8afa3"/><circle cx="21" cy="17" r=".45" fill="#b9bdb5"/></pattern>
          <clipPath id="{k}-develop-clip" clipPathUnits="userSpaceOnUse"><path class="ifm-develop-front" d="M-100 -150H1700V1200H-100Z"/></clipPath>
          {''.join(self.defs)}
        </defs>'''
        # Preserve physical occlusion in ALL states. Each shaded surface references
        # the same advancing front; opaque white paper remains underneath it.
        groups=[];last=None
        for kind,item in self.layers:
            if kind!=last:
                if last is not None:groups.append('</g>')
                cls={'paper':'ifm-paper-surfaces','render':'ifm-art-render','lines':'ifm-art-lines'}[kind]
                clip=f' data-paint="surfaces" clip-path="url(#{k}-develop-clip)"' if kind=='render' else ''
                groups.append(f'<g class="{cls}"{clip}>');last=kind
            groups.append(item)
        if last is not None:groups.append('</g>')
        return f'''<svg xmlns="http://www.w3.org/2000/svg" class="ifm-architectural-svg ifm-{k}-svg" data-artwork="{k}" viewBox="{' '.join(map(str,v))}" role="img" aria-labelledby="{k}-title {k}-desc" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <title id="{k}-title">{html.escape(self.title)}</title><desc id="{k}-desc">{html.escape(self.description)}</desc>
        {defs}
        <g class="ifm-art-accent" data-paint="accent" clip-path="url(#{k}-develop-clip)">{''.join(self.accents)}</g>
        <g class="ifm-art-stack">{''.join(groups)}</g>
        </svg>'''

def facade():
    s=Scene('facade',(-35,-90,1610,910),'La façade de l’IFMEREE Tanger, illustration architecturale','Dessin vectoriel de la façade à bardage, avec ses grandes lettres IFMEREE, les fenêtres ouvrantes, les claustras géométriques, les bâtiments voisins et les palmiers. Chaque contour fait partie du dessin animé.')
    # Neighbouring halls, faithfully following the two gables on the photograph.
    s.surface([(0,275),(206,288),(223,514),(0,509)],'#f3f4ef')
    s.surface([(206,288),(273,370),(251,511),(223,514)],'#d9ded4',hatch=True)
    s.surface([(0,271),(206,280),(218,295),(0,285)],'#515950')
    s.window([(0,351),(171,351),(170,467),(0,470)],4,2)
    for i in range(11):
        a=mix((208,291),(271,366),i/11);s.draw(line([a,(a[0]+5,a[1]+3),(a[0]+9,a[1]+29),(a[0]+4,a[1]+25)],True),'openings',1.0)
    s.surface([(276,388),(433,365),(537,389),(535,498),(271,506)],'#f5f5f0')
    s.surface([(274,385),(432,358),(539,383),(536,391),(433,368),(276,394)],'#596159')
    s.window([(434,376),(507,397),(507,492),(434,490)],3,4)
    s.window([(371,440),(399,439),(399,495),(371,495)],1,1,dark=True)
    for j in range(4):s.draw(line([(359-j*5,499+j*5),(414+j*4,500+j*5),(429+j*5,507+j*5)]),'openings',.8)
    # Lower volume and upper projection.
    s.surface([(596,415),(1491,395),(1499,639),(594,560)],'#d0d5cb',hatch=True,width=2)
    s.surface([(536,498),(596,497),(596,560),(518,570)],'#e6e8df')
    top=[(561,162),(1485,-14),(1493,399),(538,421),(539,356),(552,352)]
    s.surface(top,'#dce0d7',width=2.2)
    s.surface([(715,82),(1484,-62),(1540,-15),(1540,649),(1495,638),(1485,-12),(715,128)],'#f5f5ef',width=2)
    s.patch([(715,128),(1485,-12),(1485,15),(743,151)],INK,.18)
    s.patch([(539,421),(1493,399),(1494,417),(596,438),(596,415)],INK,.58)
    # Perspective-aligned horizontal cladding: grouped by construction course.
    q=[(561,162),(1485,-14),(1493,399),(538,421)]
    for group in range(6):
        ds=[]
        for j in range(group*8+1,(group+1)*8+1):
            t=j/50;ds.append(line([quad(q,0,t),quad(q,1,t)]))
        s.detail(' '.join(ds),.6,'#8c9588')
    low=[(596,415),(1491,395),(1499,639),(594,560)]
    for group in range(4):
        s.detail(' '.join(line([quad(low,0,j/33),quad(low,1,j/33)]) for j in range(group*8+1,(group+1)*8+1)),.55,'#929a8f')
    # Recessed glazing and projecting sashes.
    s.window([(607,209),(873,175),(871,329),(603,348)],5,3,awnings=(1,3))
    s.window([(809,420),(991,411),(994,551),(806,538)],3,2,awnings=(0,))
    s.window([(1215,415),(1294,411),(1294,581),(1216,564)],2,2)
    s.patch([(872,329),(929,401),(1028,399),(941,317)],INK,.16)
    s.patch([(806,538),(806,560),(1057,580),(994,551)],INK,.10)
    # Distinctive concrete screens, made of vector right-angle routes.
    s.screen([(559,163),(611,154),(605,341),(552,348)],2,7)
    s.screen([(1293,402),(1484,400),(1492,634),(1290,602)],7,9)
    # Three-dimensional white lettering; actual glyph contours, no SVG text image.
    s.lettering('IFMEREE',931,275,502,77,slant=-.075,color='#fbfcf8')
    # Ground-plane lines and botanical forms.
    s.draw(line([(-15,552),(185,548),(275,529),(518,557),(1498,650),(1550,659)]),'structure',1.15)
    s.draw(line([(518,569),(1499,660),(1548,669)]),'structure',.7,MID)
    s.palm(100,530,119,91,4);s.palm(343,539,114,59,-4);s.palm(520,533,83,38)
    s.hedge((3,561),(483,554),27,.9);s.hedge((555,559),(1492,644),48,.85)
    # Young foreground tree: a trunk, branch hierarchy and restrained leaf sprays.
    s.draw('M205 740Q235 589 268 443Q286 369 315 311 M211 740Q246 579 275 445 M268 448Q321 391 384 353 M274 420Q246 353 255 311 M289 379Q344 332 407 281 M305 347Q301 299 314 266 M330 377Q405 382 472 339','landscape',1.4)
    for i,(x,y,angle) in enumerate([(282,373,-1),(307,323,1),(340,339,1),(368,321,-1),(399,288,1),(352,364,-1),(391,372,1),(425,359,1),(460,343,-1),(267,353,-1),(305,282,1),(245,399,-1)]):
        sprig=[]
        for j in range(4):
            xx=x+j*6*angle;yy=y-j*5
            sprig.append(f'M{xx} {yy}q{-10*angle} -10 {-7*angle} -15q{10*angle} 1 {7*angle} 15M{xx} {yy}q{14*angle} -3 {13*angle} -10q{-10*angle} -4 {-13*angle} 10')
        s.draw(' '.join(sprig),'landscape',.65,INK)
    # Deliberate ground marks, never a photographic grass texture.
    for group in range(3):
        ds=[]
        for i in range(10):
            x=45+i*146+(group%2)*32;y=674+group*40+(i%3)*9
            ds.append(f'M{x} {y}l-3 -6m3 6 1 -9m-1 9 5 -4')
        s.detail(' '.join(ds),.55,'#a6afa0','landscape')
    return s

def campus():
    s=Scene('campus',(0,80,1536,850),'L’allée et les bâtiments de l’IFMEREE Tanger','Illustration vectorielle de l’allée du campus, de ses cinq palmiers, du panneau IFMEREE Tanger, des volumes blancs et des claustras. Le défilement développe les ombres et les matières du haut vers le bas, sur des contours stables.')
    s.accents.append(f'<circle class="ifm-architectural-circle" cx="966" cy="302" r="218" fill="{GREEN}"/>')
    # Ground surfaces and paths, before the vertical architecture.
    s.surface([(0,621),(1108,607),(1536,675),(1536,930),(0,930)],'#f1f3e9',outline=False)
    walkway=[(0,861),(1120,617),(1236,617),(416,930),(0,930)]
    s.surface(walkway,'#e5e8e1',width=1.1)
    s.surface([(0,660),(570,638),(974,613),(1117,613),(578,665),(0,695)],'#eef0e9',width=.8)
    # Paving joints converge toward the same courtyard vanishing point.
    for x in range(-180,660,90):s.shade_lines(line([(x,930),(1182+(x-230)*.04,618)]),.62,'#b0b8ac')
    for t in [.13,.25,.36,.46,.55,.63,.7,.76,.81,.855,.895,.93,.958,.978]:
        a=mix((0,861),(1120,617),t);b=mix((416,930),(1236,617),t)
        s.shade_lines(line([a,b]),.65,'#afb8ab')
    # Long teaching wing, with the measured roof slope and fin rhythm.
    s.surface([(234,380),(831,450),(831,607),(230,610)],'#f5f5ef',width=1.8)
    s.surface([(831,450),(1015,427),(1035,607),(831,607)],'#ecefe8',width=1.8)
    s.surface([(415,353),(831,434),(831,451),(416,377)],'#778278',width=1.4)
    s.patch([(416,356),(831,437),(831,449),(416,375)],BLUE,.24)
    s.surface([(831,434),(1018,418),(1020,436),(831,451)],'#778278',width=1.4)
    s.patch([(831,437),(1018,421),(1017,434),(831,449)],BLUE,.24)
    s.surface([(234,378),(416,353),(416,391),(236,413)],'#e4e8df',width=1.1)
    s.patch([(234,379),(416,353),(416,368),(236,391)],BLUE,.34)
    for i in range(14):
        if i<9:
            t=i/9;x=433+390*t;yt=371+77*t;yb=602+4*t;w=26-12*t
        else:
            t=(i-9)/5;x=850+166*t;yt=448-14*t;yb=606;w=12-3*t
        s.surface([(x,yt),(x+w,yt+2),(x+w-7,yb),(x-7,yb+1)],'#fafbf5','openings',width=1)
        s.patch([(x+w,yt+2),(x+w+12,yt+3),(x+w+4,yt+73),(x+w-7,yt+79)],INK,.70)
        s.patch([(x+w-7,yt+79),(x+w+4,yt+73),(x-20,yb),(x-32,yb)],INK,.10)
    s.window([(780,540),(827,538),(827,606),(779,607)],1,2,dark=True)
    s.window([(134,508),(359,511),(359,608),(134,609)],4,2)
    s.surface([(296,503),(393,503),(393,606),(296,606)],'#d7d9d0','openings',width=1.2)
    s.patch([(304,514),(380,514),(380,592),(304,592)],INK,.40)
    # Front portico, including soffit, beams and columns.
    s.surface([(0,393),(466,449),(465,495),(0,456)],'#f9f9f2',width=1.65)
    s.patch([(0,456),(465,495),(443,507),(0,468)],INK,.25)
    s.surface([(12,459),(50,463),(49,680),(12,694)],'#f4f5ef',width=1.25)
    s.surface([(411,491),(439,494),(437,647),(409,654)],'#f7f8f1',width=1.2)
    s.patch([(439,494),(449,501),(448,644),(437,647)],INK,.18)
    # Far end of the courtyard and stair flights.
    s.surface([(1033,532),(1382,507),(1387,603),(1034,615)],'#f5f6f0',width=1.1)
    s.window([(1061,530),(1354,511),(1354,550),(1062,569)],14,2)
    for j in range(6):
        y=579+j*6;s.draw(line([(1148-j*5,y),(1255+j*3,y-3),(1262+j*3,y+2)]),'openings',.9)
    # The right-hand patterned façade remains an actual wall, never a transparent multiply layer.
    s.surface([(1390,-40),(1536,-112),(1536,909),(1370,673)],'#f7f8f2',width=1.7)
    s.patch([(1390,-40),(1410,-50),(1391,697),(1370,673)],INK,.17)
    wall=[(1410,-49),(1537,-111),(1537,883),(1391,697)]
    for j in range(7):
        q=shape(wall,.04,j/7+.018,.95,(j+1)/7-.018);s.screen(q,3,2)
    # Campus lamps, including the distinctive curved lamp at front left.
    s.draw('M91 819L99 270Q99 228 145 216Q171 201 183 209Q168 223 146 228L115 237Q106 244 106 270L101 818Z','openings',1.5)
    s.patch([(100,270),(105,270),(101,818),(95,818)],'#6b7866',.45)
    s.surface([(144,215),(174,201),(184,208),(150,228)],'#697467','openings',width=.8)
    s.draw('M479 638L484 505Q483 493 472 492M1021 605L1027 493Q1031 479 1050 479','openings',1.1)
    # Layer palms from rear to foreground so their contours stay unambiguous.
    s.palm(1020,630,90,36,3);s.palm(947,650,122,46,-3);s.palm(832,678,190,62,3)
    s.palm(646,702,277,92,-2);s.palm(285,764,352,137,1)
    # The sign uses real vector letters aligned to its board, plus circular identity marks.
    s.surface([(1278,514),(1290,513),(1304,689),(1281,691)],'#ced5c7','openings',width=1.1)
    s.surface([(1061,525),(1069,524),(1076,625),(1068,629)],'#dfe4d7','openings',width=.9)
    s.surface([(1044,377),(1390,349),(1395,504),(1057,529)],'#f3f5ec','structure',width=1.6)
    s.lettering('IFMEREE',1124,461,241,56,slant=-.073,color='#4c7130')
    s.lettering('TANGER',1306,382,56,13,slant=-.073,color=INK)
    s.draw('M1106 399A25 25 0 1 0 1113 438 M1106 406A17 17 0 1 1 1086 432 M1091 399Q1060 426 1097 444','lettering',3.1)
    s.render.append('<path d="M1106 399A25 25 0 1 0 1113 438 M1106 406A17 17 0 1 1 1086 432" fill="none" stroke="#4c7130" stroke-width="4.2"/>')
    s.lettering('IFMEREE TANGER',1105,498,242,13,slant=-.074,color=INK)
    # Thin rules deliberately replace illegible microtype; no invented sign claims.
    s.draw('M1106 478L1359 459M1120 508L1344 491','lettering',.6,MID)
    # Borders of planting beds rather than a noisy lawn texture.
    s.hedge((0,789),(636,690),30,1.15);s.hedge((548,930),(1220,654),32,1)
    s.hedge((520,628),(1056,610),28,.65);s.hedge((28,644),(474,637),22,.7)
    s.hedge((1120,606),(1355,599),16,.65)
    # Controlled cast shadows from palms and the portico.
    s.patch([(283,763),(301,765),(503,685),(483,682)],INK,.14)
    s.patch([(641,699),(658,701),(779,646),(763,645)],INK,.13)
    s.patch([(50,680),(154,662),(163,671),(51,693)],INK,.10)
    return s

if __name__=='__main__':
    ROOT.mkdir(exist_ok=True)
    for scene in [facade(),campus()]:
        path=ROOT/f'ifmeree-{scene.key}.svg';path.write_text(scene.svg())
        print(path.name,'strokes',len(scene.ink),'surfaces',len(scene.render),'bytes',path.stat().st_size)
