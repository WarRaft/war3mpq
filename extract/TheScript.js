function navHandler(someplace){
	parent.Topic.location.href=someplace;
    parent.content.location.href="../Layout/Splash.html";
}

function platSwitchHandler(current, target){
	tLast = parent.Topic.location.href
	cLast = parent.content.location.href
	nLast = parent.Navigation.location.href
	
	tTemp = tLast.replace(current, target)
	parent.Topic.location.href = tTemp;
	
	cTemp = cLast.search(current)
	if(cTemp != -1){
		cTemp = cLast.replace(current, target)
		parent.content.location.href = cTemp;
	}
	
	nTemp = nLast.replace(current, target)
	parent.Navigation.location.href = nTemp;
	
	plat = parent.TopBorder.document.images
	plat[3].src = "../Images/WinLogo.jpg";

}

function loading() {
t = parent.Topic.location.href
first = t.indexOf("Help/") + 5
last = t.lastIndexOf("/")
temp = t.substring(first, last)
current = document.images
if(temp == "BattleNet"){
	navSub = 3
	lastButton = 3
	button = 3
	current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
}else if(temp == "ReadMe"){
	navSub = 2
	lastButton = 2
	button = 2
	current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
}else if(temp == "Support"){
	navSub = 4
	lastButton = 4
	button = 4
	current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
}else{
	navSub = 5
	lastButton = 5
	button = 5
	current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
}
}

function rollover(code, button){
	current = document.images
	switch(code){
		case 0:
			current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			break
		case 1:
			switch(button){
				case 1:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
				case 2:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 3:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 4:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 5:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				default:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
			}
			break
		case 2:
			current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			lastButton = button
			navSub = button
			break
		case 3:
			t = parent.Topic.location.href
			first = t.indexOf("Help/") + 5
			last = t.lastIndexOf("/")
			temp = t.substring(first, last)
			
			if(temp == "BattleNet"){
				navSub = 3
				lastButton = 3
				button = 3
				current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			}else if(temp == "ReadMe"){
				navSub = 2
				lastButton = 2
				button = 2
				current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			}else if(temp == "Support"){
				navSub = 4
				lastButton = 4
				button = 4
				current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			}else{
				navSub = 5
				lastButton = 5
				button = 5
				current[0].src = "../Images/Nav/Nav_"+lastButton+button+".jpg"
			}
			
			break
		default:
			switch(button){
				case 1:
					break
				case 2:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 3:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 4:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				case 5:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
				default:
					current[0].src = "../Images/Nav/Nav_"+navSub+"0.jpg"
					break
			}
			break
	}
	
}