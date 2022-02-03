var facb=false,powb=false,rootb=false;
var tar=0,res="";

class op{
	constructor(a,b){
		this.val=a; this.s=b;
	}
}

function random(mn,mx){ return mn+Math.random()*(mx-mn) }
function fac(n){ return (n==0) ? 1 : n*fac(n-1); }
function powable(m,n,tot){ return (tot>1000000 || n>30) ? false : (n==0) ? true : powable(m,n-1,tot*m); }
function rootable(m,n){ return true;}
function checkvalidnumber(n,mn,mx){ return (isNaN(n)) ? false : (n<mx && n>=mn && n-parseInt(n)==0) }
function rules(a){ if(a.id=="pwcb") powb=a.checked; if(a.id=="ftrcb") facb=a.checked; if(a.id=="rcb") rootb=a.checked; }
function clr(){
	for(var i=1;i<7;i++) document.getElementById("num"+String(i)).value="";
	document.getElementById("target").value="";
	document.getElementById("dis").innerHTML="&nbsp";
}
function checkproblem(sw){
	var bf=0;
	for(var i=1;i<7;i++){
		if(document.getElementById("num"+String(i)).value!=""){ if(!checkvalidnumber(document.getElementById("num"+String(i)).value,1,10))
		{ document.getElementById("dis").innerText="Please put numbers correctly"; return; }}
		else bf++;
	}
	if(bf==6) { document.getElementById("dis").innerText="Please put some numbers in boxes"; return; }
	if(!checkvalidnumber(document.getElementById("target").value,1,1000)){ document.getElementById("dis").innerText="Please put the target number correctly"; return; }
	
	document.getElementById("dis").innerText="calculating.."
	tar=parseInt(document.getElementById("target").value);
	var l=[]; for(var i=1;i<7;i++)
	if(document.getElementById("num"+String(i)).value!="") l.push(new op(parseInt(document.getElementById("num"+String(i)).value),document.getElementById("num"+String(i)).value));
	if(!find(l)) document.getElementById("dis").innerText="There is no solution";
	else document.getElementById("dis").innerText=res;
	if(!sw){
		var ass=document.getElementById("dis").innerText;
		document.getElementById("dis").innerHTML="&nbsp";
		return ass!="There is no solution"
	}
}
function randomq(n,mn,mx){
	clr();
	for(var i=1;i<=n;i++)document.getElementById("num"+String(i)).value=parseInt(random(1,10));
	document.getElementById("target").value=parseInt(random(mn,mx));
	if(!checkproblem(false)) randomq(n,mn,mx);
}

function find(lis){
	if(lis.length==1 && lis[0].val==tar){ res=lis[0].s+"="+String(tar); return true; }
	else if(lis.length==1 && lis[0].val>2 && lis[0].val<8 && facb){
	  var l=lis.slice();
	  var m=l[0];
	  l.shift(); l.push(new op(fac(m.val),m.s+"!"));
	  if(find(l)) return true;
	}
	else if(lis.length>1){
	  for(var i=0;i<lis.length;i++) for(var j=0;j<lis.length;j++){
		if(i==j) continue;
		var li=lis.slice(); var l=[];
		var m=lis[i],n=lis[j];
		li.splice(i,1); li.splice((i<j) ? j-1 : j,1);
		l=li.slice(); l.push(new op(m.val+n.val,"("+m.s+"+"+n.s+")"));
		if(find(l)) return true;
		if(m.val>n.val){
		  l=li.slice(); l.push(new op(m.val-n.val,"("+m.s+"-"+n.s+")"));
		  if(find(l)) return true;
		}
		l=li.slice(); l.push(new op(m.val*n.val,"("+m.s+"*"+n.s+")"));
		if(find(l)) return true;
		if(m.val!=0 || n.val!=0) if(m.val%n.val==0){
		  l=li.slice(); l.push(new op(parseInt(m.val/n.val),"("+m.s+"/"+n.s+")"));
		  if(find(l)) return true;
		}
		if(powb){
		  if(powable(m.val,n.val,1)){
			l=li.slice(); l.push(new op(parseInt(Math.pow(m.val,n.val)),"("+m.s+"^"+n.s+")"));
			if(find(l)) return true;
		  }
		}
	  }
	}
	return false;
  }