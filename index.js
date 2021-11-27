//Estado
    	//  y dy  x dx  z dz  p  q  r  p  t  p
Y 	  = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
Y_lin = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]

//Controles
w1 = 0
w2 = 0
w3 = 0
w4 = 0

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
g = 9.81
m = 8.01

slider = []

lineal = false
comparar = false
w_estable = Math.sqrt(g*m/k)/2
	
function setup() {
	createCanvas(800, 600, WEBGL)
	tex = loadImage("checkerboard.png")
	font = loadFont("Inconsolata.ttf")
	textFont(font)
	textSize(20)
	textureWrap(REPEAT)
	frameRate(60)
	
	for (let i = 0; i < 4; i++) {
		slider[i] = createSlider(w_estable - 25, w_estable + 25, w_estable, 2)
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
		Y = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
		Y_lin = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
	});
	
	checkbox = createCheckbox('Linealizado', false)
	checkbox.position(400, 10)
	checkbox.changed(myCheckedEvent)
	
	checkbox = createCheckbox('Comparar', false)
	checkbox.position(400, 25)
	checkbox.changed(myCheckedEvent2)
}

function myCheckedEvent() {
	lineal = !lineal
}

function myCheckedEvent2() {
	comparar = !comparar
}

function simular() {
	w1 = slider[0].value()
	w2 = slider[1].value()
	w3 = slider[2].value()
	w4 = slider[3].value()
	w1_lin = Math.pow(w1,2) - Math.pow(w_estable,2)
	w2_lin = Math.pow(w2,2) - Math.pow(w_estable,2)
	w3_lin = Math.pow(w3,2) - Math.pow(w_estable,2)
	w4_lin = Math.pow(w4,2) - Math.pow(w_estable,2)
	let dY = []
	let dY_lin = []
	dY = pasoLinealizado(Y)
	dY = paso(Y)
	dY_lin = pasoLinealizado(Y_lin)
	for (let i = 0; i <= 15; i++) {
		Y[i] = Y[i] + dY[i] * 1/60
		Y_lin[i] = Y_lin[i] + dY_lin[i] * 1/60
	}
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
	
	//dron no lineal
	push()
	translate(Y[3] * 10, Y[1] * 10, -Y[5] * 10)
	rotateX(-Y[10])
	rotateY(-Y[11])
	rotateZ(Y[12])
	noStroke()
	if (lineal && comparar) {
		specularMaterial(255, 10)
	}
	if (!lineal || comparar) {
		torus(10, 5)
		drawArrow(createVector(0, 0, 0), createVector(25, 0, 0), "orange")
	}
	pop()
	
	//dron lineal
	push()
	translate(Y_lin[3] * 10, Y_lin[1] * 10, -Y_lin[5] * 10)
	rotateX(-Y_lin[10])
	rotateY(-Y_lin[11])
	rotateZ(Y_lin[12])
	noStroke()
	if (!lineal && comparar) {
		specularMaterial(255, 10)
	}
	if (lineal || comparar) {
		torus(10, 5)
		drawArrow(createVector(0, 0, 0), createVector(25, 0, 0), "orange")
	}
	pop()
	
	//flechas ejes absolutos
	drawArrow(createVector(0, 0, 0), createVector(100, 0, 0), "red")
	drawArrow(createVector(0, 0, 0), createVector(0, 100, 0), "green")
	rotateX(Math.PI/2)
	drawArrow(createVector(0, 0, 0), createVector(0, -100, 0), "blue")
	
	//dibujar texto en pantalla	
	camera()
	let Yprint = Y
	if (lineal) {
		Yprint = Y_lin
	}
		
	text(
		"x: " + Yprint[3] + "\ny: " + Yprint[1] + "\nz: " + Yprint[5] + "\ndz: " + Yprint[6] +
		"\nphi: " + Yprint[10] + "\ntheta: " + Yprint[11] + "\npsi: " + Yprint[12] +
		"\np: " + Yprint[7] + "\nq: " + Yprint[8] + "\nr: " + Yprint[9]
		, -350, -250)
	text(
		"w1 rad/s: " + Math.trunc(slider[0].value()) + " \n" +
		"w2 rad/s: " + Math.trunc(slider[1].value()) + " \n" +
		"w3 rad/s: " + Math.trunc(slider[2].value()) + " \n" +
		"w4 rad/s: " + Math.trunc(slider[3].value()) + " \n"
		, 0, -250)
}

function paso(Y) {
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

function pasoLinealizado(Y) {
	let X = []
	X[0] = 0
	X[1] = Y[2]
	X[2] = -g*Y[10]
	X[3] = Y[4]
	X[4] = g*Y[11]
	X[5] = Y[6]
	X[6] = (k*(w1_lin + w2_lin + w3_lin + w4_lin))/m
	X[7] = -(L*k*(w2_lin - w4_lin))/I_xx
	X[8] = -(L*k*(w1_lin - w3_lin))/I_yy
	X[9] = (d*(w1_lin - w2_lin + w3_lin - w4_lin))/I_zz
	X[10] = Y[7]
	X[11] = Y[8]
	X[12] = Y[9]
	return X
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