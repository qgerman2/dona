//Estado
	//  y dy  x dx  z dz  p  q  r  p  t  p
Y = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]

//Controles
w1 = 0
w2 = 0
w3 = 0
w4 = 0

//Constantes
I_xx = 5e-3
I_yy = 5e-3
I_zz = 10e-3
k = 3e-6
d = 1e-6
L = 0.3
g = 9.81
m = 0.5

slider = []
	
function setup() {
	createCanvas(800, 600, WEBGL)
	tex = loadImage("checkerboard.png")
	font = loadFont("Inconsolata.ttf")
	textFont(font)
	textSize(20)
	textureWrap(REPEAT)
	frameRate(60)
	
	for (let i = 0; i < 4; i++) {
		slider[i] = createSlider(0, 1000, 650, 1)
		slider[i].position(550, 40 + i * 25)
		slider[i].style('width', '500px')
	}
	
	button1 = createButton("5920 rpm")
	button1.position(550, 10)
	button1.mousePressed(() => {
		for (let i = 0; i < 4; i++) {
			slider[i].value(620)
		}
	});
	
	button2 = createButton("Respawn")
	button2.position(650, 10)
	button2.mousePressed(() => {
		Y = [0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0]
	});
}

function simular() {
	w1 = slider[0].value()
	w2 = slider[1].value()
	w3 = slider[2].value()
	w4 = slider[3].value()
	let dY = paso(Y)
	for (let i = 0; i <= 15; i++) {
		Y[i] = Y[i] + dY[i] * 1/60 
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
	
	push()
	translate(Y[3] * 10, Y[1] * 10, -Y[5] * 10)
	rotateX(-Y[10])
	rotateY(-Y[11])
	rotateZ(Y[12])
	noStroke()
	torus(10, 5)
	drawArrow(createVector(0, 0, 0), createVector(25, 0, 0), "orange")
	pop()
	
	//flechas ejes absolutos
	drawArrow(createVector(0, 0, 0), createVector(100, 0, 0), "red")
	drawArrow(createVector(0, 0, 0), createVector(0, 100, 0), "green")
	rotateX(Math.PI/2)
	drawArrow(createVector(0, 0, 0), createVector(0, -100, 0), "blue")
	
	
	//dibujar texto en pantalla	
	camera()
	text(
		"x: " + Y[3] + "\ny: " + Y[1] + "\nz: " + Y[5] + "\ndz: " + Y[6] +
		"\nphi: " + Y[10] + "\ntheta: " + Y[11] + "\npsi: " + Y[12] +
		"\np: " + Y[7] + "\nq: " + Y[8] + "\nr: " + Y[9]
		, -350, -250)
	text(
		"w1 rpm: " + Math.trunc(slider[0].value() * 9.5493) + " \n" +
		"w2 rpm: " + Math.trunc(slider[1].value() * 9.5493) + " \n" +
		"w3 rpm: " + Math.trunc(slider[2].value() * 9.5493) + " \n" +
		"w4 rpm: " + Math.trunc(slider[3].value() * 9.5493) + " \n"
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