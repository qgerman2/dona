//Estado

Y   = [0, 10, 0, 7, 0, 5, 0, 0, 0, 0, 0, 0, 0]
//        x dx   y dy  z dz  p  q  r  p  t  p
Y_lin = [10, 0, 7, 0, 5, 0, 0, 0, 0, 0, 0, 0]

//Error acumulado
ERR 	= [0, 0, 0, 0, 0, 0]
ERR_lin = [0, 0, 0, 0, 0, 0]

//Controles
automatico = true
w1=0
w2=0
w3=0
w4=0
w1_lin = 0
w2_lin = 0
w3_lin = 0
w4_lin = 0

//Constantes
I_xx = 8.15e-2
I_yy = 8.15e-2
I_zz = 1.28e-1
L = 0.3
k = 3e-6
d = 7.5e-7
g = 9.806
m = 8.01
A = math.matrix([
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, g, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0,-g, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
])
B = math.matrix([
             [0,        0,       0,        0],
             [0,        0,       0,        0],
             [0,        0,       0,        0],
             [0,        0,       0,        0],
             [0,        0,       0,        0],
           [k/m,      k/m,     k/m,      k/m],
             [0,        0,       0,        0],
             [0,-L*k/I_xx,       0, L*k/I_xx],
             [0,        0,       0,        0],
     [-L*k/I_yy,        0,L*k/I_yy,        0],
             [0,        0,       0,        0],
        [d/I_zz,  -d/I_zz,  d/I_zz,  -d/I_zz]
])
C = math.matrix([
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
]);
p = 6

K = math.matrix([
[265087.65720000001601874828338623046875000000000000000000,1680384.88459999999031424522399902343750000000000000000000,-167682.15309999999590218067169189453125000000000000000000,-1063460.90479999990202486515045166015625000000000000000000,147418.24569999999948777258396148681640625000000000000000,627521.34519999998155981302261352539062500000000000000000,22035909.23090000078082084655761718750000000000000000000000,15514520.18930000066757202148437500000000000000000000000000,34791741.24270000308752059936523437500000000000000000000000,24447457.40790000185370445251464843750000000000000000000000,9023.99940000000060535967350006103515625000000000000000,39253.33209999999962747097015380859375000000000000000000],
[265179.75449999998090788722038269042968750000000000000000,1681452.59309999994002282619476318359375000000000000000000,-167669.97169999999459832906723022460937500000000000000000,-1062904.06300000008195638656616210937500000000000000000000,147418.24650000000838190317153930664062500000000000000000,627521.34690000000409781932830810546875000000000000000000,22004289.51709999889135360717773437500000000000000000000000,15449531.95570000074803829193115234375000000000000000000000,34834033.67140000313520431518554687500000000000000000000000,24520023.59470000118017196655273437500000000000000000000000,-9024.00059999999939464032649993896484375000000000000000,-39253.33449999999720603227615356445312500000000000000000],
[265440.50719999999273568391799926757812500000000000000000,1683597.28590000001713633537292480468750000000000000000000,-167850.74079999999958090484142303466796875000000000000000,-1064538.05520000006072223186492919921875000000000000000000,147418.24770000000717118382453918457031250000000000000000,627521.34939999994821846485137939453125000000000000000000,22058401.10680000111460685729980468750000000000000000000000,15530482.29209999926388263702392578125000000000000000000000,34898802.18760000169277191162109375000000000000000000000000,24608532.05810000002384185791015625000000000000000000000000,9023.99940000000060535967350006103515625000000000000000,39253.33209999999962747097015380859375000000000000000000],
[265348.05619999999180436134338378906250000000000000000000,1682527.51110000000335276126861572265625000000000000000000,-167862.64980000001378357410430908203125000000000000000000,-1065092.84590000007301568984985351562500000000000000000000,147418.24710000000777654349803924560546875000000000000000,627521.34809999994467943906784057617187500000000000000000,22089971.52149999886751174926757812500000000000000000000000,15595430.95979999937117099761962890625000000000000000000000,34856470.66110000014305114746093750000000000000000000000000,24535941.00439999997615814208984375000000000000000000000000,-9024.00059999999939464032649993896484375000000000000000,-39253.33449999999720603227615356445312500000000000000000]
])
xr = [0,0,0,0,0,0,0.13485065395667833465509488632960710674524307250977,-0.02461379071468841259195947657190117752179503440857,0.32037752563520355275628048730141017585992813110352,-0.05863309198037613967358083755243569612503051757812,0,0]

ai = 0
kz = [-ai,-ai,-ai,-ai,-ai,-ai]
//Objetivo controlador
yr = [0, 0, 10, 0, 0, 0]

slider = []

w_estable = Math.sqrt(g*m/k)/2

lineal = false
	
function setup() {
	createCanvas(800, 600, WEBGL)
	tex = loadImage("checkerboard.png")
	font = loadFont("Inconsolata.ttf")
	textFont(font)
	textSize(20)
	textureWrap(REPEAT)
	frameRate(60)
	
	for (let i = 0; i < 4; i++) {
		slider[i] = createSlider(1000, 10000, w_estable)
		slider[i].position(550, 40 + i * 25)
		slider[i].style('width', '500px')
	}
	
	button1 = createButton("Flotar")
	button1.position(550, 10)
	button1.mousePressed(() => {
		for (let i = 0; i < 4; i++) {
			slider[i].value(w_estable)
		}
	});
	console.log("1/60")
	button2 = createButton("Respawn")
	button2.position(650, 10)
	button2.mousePressed(() => {
		Y = [0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
		Y_lin = [0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
	});
	Ag = math.subtract(A, math.multiply(B, K))
	M = math.multiply(math.multiply(math.multiply(math.multiply(-1,C), math.inv(Ag)), B), K);
	
	checkbox = createCheckbox('Linealizado', false)
	checkbox.position(400, 10)
	checkbox.changed(myCheckedEvent)
}

function myCheckedEvent() {
	lineal = !lineal
}

function myCheckedEvent2() {
	comparar = !comparar
}

function mouseClicked() {
	Y   = [0,(mouseX-400)/20, 0, -(mouseY-300)/20, 0, 5, 0, 0, 0, 0, 0, 0, 0]
	Y_lin = [(mouseX-400)/20, 0, -(mouseY-300)/20, 0, 5, 0, 0, 0, 0, 0, 0, 0]
	console.log(Yfix(Y), Y_lin)
	ERR 	= [0, 0, 0, 0, 0, 0]
	ERR_lin = [0, 0, 0, 0, 0, 0]
}

function simular() {
	//no lineal
	u = math.subtract(math.multiply(math.multiply(K, -1), math.subtract(Yfix(Y), xr)), math.multiply(kz,ERR))
	w1 = Math.sqrt(u.get([0]) + Math.pow(w_estable,2))
	w2 = Math.sqrt(u.get([1]) + Math.pow(w_estable,2))
	w3 = Math.sqrt(u.get([2]) + Math.pow(w_estable,2))
	w4 = Math.sqrt(u.get([3]) + Math.pow(w_estable,2))
	Xn = nolineal(Y)
	Rn = math.subtract(math.multiply(C, Yfix(Y)), yr)
	//lineal
	u_lin = math.subtract(math.multiply(math.multiply(K, -1), math.subtract(Y_lin, xr)), math.multiply(kz,ERR_lin))
	Xn_lin = math.add(math.multiply(A,Y_lin), math.multiply(B, u_lin))
	Rn_lin = math.subtract(math.multiply(C, Y_lin), yr)
	moversliders(u, u_lin)
	for (let i = 0; i < 12; i++) {
		Y_lin[i] = Y_lin[i] + Xn_lin.get([i]) * 1/60
	}
	for (let i = 1; i < 13; i++) {
		Y[i] = Y[i] + Xn[i] * 1/60
	}
	for (let i = 0; i < 6; i++) {
		ERR_lin[i] = ERR_lin[i] + Rn_lin.get([i]) * 1/60
		ERR[i] = ERR[i] + Rn.get([i]) * 1/60
	}
}

function moversliders(u, u_lin) {
	if (!lineal) {
		slider[0].value(w1)
		slider[1].value(w2)
		slider[2].value(w3)
		slider[3].value(w4)
	} else {
		for (let i = 0; i < 4; i++) {
			slider[i].value(Math.sqrt(u_lin.get([i]) + Math.pow(w_estable,2)))
		}
	}
}

function nolineal(Y) {
	let X = []
	X[0] = 0
	X[1] = Y[2]
	X[2] = -(k*(cos(Y[12])*sin(Y[10]) - cos(Y[10])*sin(Y[11])*sin(Y[12]))*(Math.pow(w1,2) + Math.pow(w2,2) + Math.pow(w3,2) + Math.pow(w4,2)))/m
	X[3] = Y[4]
	X[4] = (k*(sin(Y[10])*sin(Y[12]) + cos(Y[10])*cos(Y[12])*sin(Y[11]))*(Math.pow(w1,2) + Math.pow(w2,2) + Math.pow(w3,2) + Math.pow(w4,2)))/m
	X[5] = Y[6]
	X[6] = (k*cos(Y[10])*cos(Y[11])*(Math.pow(w1,2) + Math.pow(w2,2) + Math.pow(w3,2) + Math.pow(w4,2)))/m - g
	X[7] = -(I_zz*Y[8]*Y[9] - I_yy*Y[8]*Y[9] + L*k*(Math.pow(w2,2) - Math.pow(w4,2)))/I_xx
	X[8] = -(I_xx*Y[7]*Y[9] - I_zz*Y[7]*Y[9] + L*k*(Math.pow(w1,2) - Math.pow(w3,2)))/I_yy
	X[9] = (d*(Math.pow(w1,2) - Math.pow(w2,2) + Math.pow(w3,2) - Math.pow(w4,2)) + I_xx*Y[7]*Y[8] - I_yy*Y[7]*Y[8])/I_zz
	X[10] = Y[7] + cos(Y[10])*tan(Y[11])*Y[9] + sin(Y[10])*tan(Y[11])*Y[8]
	X[11] = cos(Y[10])*Y[8] - sin(Y[10])*Y[9]
	X[12] = (cos(Y[10])*Y[9])/cos(Y[11]) + (sin(Y[10])*Y[8])/cos(Y[11])
	return X
}


function draw() {
	//evaluar ecuaciones
	simular()
	
	clear()
	//dibujar mundo
	background(200)
	camera(-200, -200, -200, 0, 0, 0, 0, 0, 1)
	ambientLight(120, 120, 120)
	pointLight(255, 255, 255, -100, -100, -100)
	
	push()
	texture(tex)
	noStroke()
	plane(300, 300)
	pop()
	
	if (lineal) {
		drawlineal()
		drawnolineal()
	} else {
		drawnolineal()
		drawlineal()
	}	
	
	//flechas ejes absolutos
	drawArrow(createVector(0, 0, 0), createVector(100, 0, 0), "red")
	drawArrow(createVector(0, 0, 0), createVector(0, 100, 0), "green")
	rotateX(Math.PI/2)
	drawArrow(createVector(0, 0, 0), createVector(0, -100, 0), "blue")
	
	//dibujar texto en pantalla	
	camera()
	Yprint = Y_lin
	if (!lineal) {
		Yprint = Yfix(Y)
	}
		
	text(
		"x: " + Yprint[0] + "\ny: " + Yprint[2] + "\nz: " + Yprint[4] + "\ndz: " + Yprint[5] +
		"\nphi: " + Yprint[6] + "\ntheta: " + Yprint[8] + "\npsi: " + Yprint[10] +
		"\np: " + Yprint[7] + "\nq: " + Yprint[9] + "\nr: " + Yprint[11]
		, -350, -250)
	text(
		"w1 rad/s: " + Math.round(slider[0].value(), 2) + " \n" +
		"w2 rad/s: " + Math.round(slider[1].value(), 2) + " \n" +
		"w3 rad/s: " + Math.round(slider[2].value(), 2) + " \n" +
		"w4 rad/s: " + Math.round(slider[3].value(), 2) + " \n"
		, 0, -250)
}

function drawnolineal() {
	push()
	translate(Y[1] * 10, Y[3] * 10, -Y[5] * 10)
	rotateX(-Y[10])
	rotateY(-Y[11])
	rotateZ(Y[12])
	noStroke()
	if (lineal) {
		specularMaterial(255, 100)
	}
	torus(10, 5)
	drawArrow(createVector(0, 0, 0), createVector(25, 0, 0), "orange")
	pop()
}

function drawlineal() {
	push()
	translate(Y_lin[0] * 10, Y_lin[2] * 10, -Y_lin[4] * 10)
	rotateX(-Y_lin[6])
	rotateY(-Y_lin[8])
	rotateZ(Y_lin[10])
	noStroke()
	if (!lineal) {
		specularMaterial(255, 100)
	}
	torus(10, 5)
	drawArrow(createVector(0, 0, 0), createVector(25, 0, 0), "orange")
	pop()
}

//https://p5js.org/reference/#/p5.Vector/magSq
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 5;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}

function Yfix(Y) {
	return [Y[3], Y[4], Y[1], Y[2], Y[5], Y[6], Y[10], Y[7], Y[11], Y[8], Y[12], Y[9]]
}

//https://p5js.org/examples/3d-ray-casting.html
class IntersectPlane {
  constructor(n1, n2, n3, p1, p2, p3) {
    this.normal = createVector(n1, n2, n3); // The normal vector of the plane
    this.point = createVector(p1, p2, p3); // A point on the plane
    this.d = this.point.dot(this.normal);
  }

  getLambda(Q, v) {
    return (-this.d - this.normal.dot(Q)) / this.normal.dot(v);
  }
}
