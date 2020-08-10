const canvas=document.getElementById("canvas");
    canvas.width=window.innerWidth;
    canvas.height=350;
    const cxt=canvas.getContext("2d");
    document.body.appendChild(canvas);

	var perm = [];
	while(perm.length < 255){
		while(perm.includes(val = Math.floor(Math.random() * 255)));
			perm.push(val);
	}

	var lerp = (a, b, t) => a + (b-a) * (1 - Math.cos(t * Math.PI))/2;

	var noise = x => {
		x = x * 0.01 % 255;
		return lerp(perm[Math.floor(x)], perm[Math.ceil(x)], x - Math.floor(x));
	}

	var player = new function(){
		this.x = canvas.width/2;
		this.y = 0;
		this.yspeed = 0;
		this.rot = 0;
		this.rspeed = 0;

		this.img = new Image();
		this.img.src = "play.png";
		this.draw = function(){
			
			var p1 = canvas.height - noise(t+this.x) * 0.25;
			var p2 = canvas.height - noise(t+5+this.x) * 0.25;
			
			var grounded = 0;
			if(p1-15 > this.y){
			 	this.yspeed += 0.1; 
			}
			else{
			 	this.yspeed -= this.y - (p1 - 15);
			 	this.y = p1 - 15;
			 	grounded = 1;
			}

			if(!playing || grounded && Math.abs(this.rot) > Math.PI * 0.5){
			 	playing = false;
			 	this.rspeed = 5;
			 	k.ArrowUp = 1;
			 	this.x -= speed * 5;
			}

			this.y += this.yspeed;

			var angle = Math.atan2((p2-15) - this.y, (this.x+5) - this.x);

			if(grounded && playing){
				this.rot -= (this.rot - angle) * 0.5;
				this.rspeed = this.rspeed - (angle - this.rot);
			}

			if((this.x == 491 || this.x == 768) && k.ArrowUp){
				dist=dist+0.1;
				score= (dist - (dist%1));
			}
			console.log(this.y + " " + this.yspeed + " " + this.rot + " " + this.rspeed);
			document.getElementById("score").innerHTML = score;

			this.rspeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
			this.rot -= this.rspeed * 0.1;
			if(this.rot > Math.PI)	this.rot = -Math.PI;
			if(this.rot < -Math.PI)	this.rot = Math.PI;

			if(this.rspeed>=5){
				out +=1;
				if(out>=50){
					out=0;
					TopScore(score);
					alert("Game Over");
					alert("Your score: "+score);
					location.reload();
				}
			}
			
			cxt.save();
			cxt.translate(this.x, this.y);
			cxt.rotate(this.rot)
			cxt.drawImage(this.img, -15, -15, 30, 30);
			cxt.restore();
		}
	}

	var t;
	var speed;
	var playing;
	var k;
	var dist;
	var out;
	var score;

	function loop(){
		speed -= (speed - (k.ArrowUp - k.ArrowDown)) * 0.01;
		t += 10 * speed;
		cxt.fillStyle = "#19f";
		cxt.fillRect(0, 0, canvas.width, canvas.height);

		cxt.fillStyle = "black";
		cxt.beginPath();
		cxt.moveTo(0, canvas.height);
		for(let i=0; i<canvas.width; i++){
			cxt.lineTo(i, canvas.height - noise(t+i) * 0.25);
		}

		cxt.lineTo(canvas.width, canvas.height);
		cxt.fill();

		player.draw();
		requestAnimationFrame(loop);
	}

	onkeydown = d => k[d.key]  = 1;
	onkeyup = d => k[d.key]  = 0;

	var temp=localStorage.getItem('HighScore');
        var highScore;
            highScore = JSON.parse(temp);
            if (highScore == null){
                highScore = 0;
            }
        function TopScore(recent_score) {
            if(recent_score>highScore){
                highScore=recent_score;
            }

            localStorage.setItem("HighScore", JSON.stringify(highScore));
            document.getElementById('HSc').innerHTML = localStorage.getItem("HighScore");
            localStorage.getItem('HighScore');
        };
    
    function pageload(){
    	document.getElementById('HSc').innerHTML = localStorage.getItem("HighScore");
    	t=0;
    	speed=0;
    	playing=true;
    	dist = 0;
    	out = 0;
    	score = 0;
    	k = {ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0};
    	loop();
    }