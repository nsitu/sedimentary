// examples of Web Audio API synths

// SimpleMonoSample
// usage example:
// x = new SimpleMonoSample("path-to-sound.wav");
// x.play(1.5); // ; play first 1.5 seconds of sound
// x.play(1.5,0.5); // ; play for 1.5 seconds, down an octave (rate=0.5)
// x.play(1.5,0.5,0.2); // ; play for 1.5secs,down an octave, start 0.2 secs into sample
playRed = false;
playBlue = false;
playGold = false;

SimpleMonoSample = function(url) {
  this.url = url;
  var request = new XMLHttpRequest();
  request.open('GET',url,true);
  request.responseType = 'arraybuffer';
  var closure = this; // a closure is necessary for...
  request.onload = function() {
      var data = request.response;
      ac.decodeAudioData(data, function(x) {
        console.log("buffer loaded");
        closure.buffer = x; // ...the decoded data to be kept in the object
      },
      function(err) {
        console.log("error decoding buffer");
      });
  };
  request.send();
  this.gain = ac.createGain();
  this.gain.connect(ac.destination);
  this.playing = false;
}

SimpleMonoSample.prototype.play = function (amp,dur,rate,startPos) {

  if(amp == null) amp = 1;
  if(rate == null) rate = 1; // if 2nd argument not given, defaults to 1
  if(startPos == null) startPos = 0.0; // if 3rd arg not given, defaults 0
  if(this.playing == false) { // only play if not already playing
    this.playing = true;
    this.source = ac.createBufferSource();
    this.source.playbackRate.value = rate;
    this.source.buffer = this.buffer;
    this.source.connect(this.gain);
    var now = ac.currentTime;
    this.source.start(now,startPos);
    this.gain.gain.setValueAtTime(0,now);
    this.gain.gain.linearRampToValueAtTime(amp,now+0.003); // 3 ms fade-in
    if (dur > 0){
      this.gain.gain.linearRampToValueAtTime(amp,now+dur-0.003);  // hold
      this.gain.gain.linearRampToValueAtTime(0,now+dur);  // 3 ms fade-out
    }
    var closure = this;
    setTimeout(function() {
      closure.playing = false; // make synth available again...
    },(dur*1000)+250); // ...a quarter second after envelope finishes
  } else console.log("warning: attempt to play synth that was already playing");
}

var rand = Math.random() * 1000+500,
     randother = Math.random() * 1000+500,
     randanother = Math.random() * 1000+500;

function apertInitialize() {
  // $('body').css({ 'width' : '100%', 'height' : '100%', 'background': 'url(ajax-loader.gif) no-repeat 50% 50%' } );


    $('<div/>', { id: 'theGoldPill' }).appendTo('body').css({
        'width' : '50%', 'height' : '20%',
        'position' : 'absolute', 'top': '10%', 'left' : '25%',
        'background-color': 'rgba(170, 240, 38,0.5)',
        'border-radius' : '100px'
      }).click(function(){
        playGold = true; playBlue = false; playRed = false;
          $('#theRedPill').css({'border': 'none'});
          $('#theBluePill').css({'border': 'none'});
          $('#theGoldPill').css({'border': '5px solid rgba(170, 240, 38, 1)'});
      });
  $('<div/>', { id: 'theBluePill' }).appendTo('body').css({
      'width' : '50%', 'height' : '20%',
      'position' : 'absolute', 'top': '40%', 'left' : '25%',
      'background-color': 'rgba(38,38,170,0.5)',
      'border-radius' : '100px'
    }).click(function(){
      playBlue = true; playRed = false; playGold = false;
        $('#theRedPill').css({'border': 'none'});
        $('#theGoldPill').css({'border': 'none'});
        $('#theBluePill').css({'border': '5px solid rgba(38, 38, 170, 1)'});
    });
    $('<div/>', { id: 'theRedPill' }).appendTo('body').css({
        'width' : '50%', 'height' : '20%',
        'position' : 'absolute', 'top': '70%', 'left' : '25%',
        'background-color': 'rgba(170,38,38,0.5)',
        'border-radius' : '100px'
      }).click(function(){
          playRed = true; playBlue = false; playGold=false;
          $('#theRedPill').css({'border': '5px solid rgba(170,38,38,1)'});
          $('#theBluePill').css({'border': 'none'});
          $('#theGoldPill').css({'border': 'none'});
      });

  setInterval(function() { jigglePills(); }, 60 );

  simpleMonoSampleBank = new Array(10);
  for(var n=0;n<10;n++) {
    console.log("created synth " + n)
    // simpleMonoSampleBank[n] = new SimpleMonoSample("uhoh-mono-16bit.wav");
    simpleMonoSampleBank[n] = new SimpleMonoSample("RockScrape11.wav");
  }
}

function redPulse(){
  $('#theRedPill').css('background-color', 'rgba(170,38,38,1)' ).animate({'background-color':'rgba(170,38,38,0.5)'}, 100);
}
function bluePulse(){
  $('#theBluePill').css('background-color', 'rgba(38,38,170,1)' ).animate({'background-color':'rgba(38,38,170,0.5)'}, 100);
}
function goldPulse(){
  $('#theGoldPill').css('background-color', 'rgba(170,240,38,1)' ).animate({'background-color':'rgba(170,240,38,0.5)'}, 100);
}


function jigglePills(){
  $('#theRedPill').css('transform', 'rotate(' + ( Math.sin(	( new Date().getTime()+rand) / 2000  	) * 5 )  + 'deg)');
  $('#theBluePill').css('transform', 'rotate(' + ( Math.sin(	(new Date().getTime()-randanother) / 2000  	) * 5 )  + 'deg)');
  $('#theGoldPill').css('transform', 'rotate(' + ( Math.sin( (	new Date().getTime()+randother ) / 2000  	) * 5 )  + 'deg)');
}

function playSimpleMonoSample(amp,dur,rate,startPos) {
  if (!playRed) return;
  redPulse();
  var n;
  for(n=0;n<10;n++) {
    if(simpleMonoSampleBank[n].playing==false)break;
  }
  if(n<10) {
    simpleMonoSampleBank[n].play(amp,dur,rate,startPos);
  }
  else console.log("warning: all synth instances already plaing");
}

function simpleSaw(freq,amp) {
if (!playGold) return;

  var temp = [261.626,311.127,349.228,369.994,391.995,466.164];
  var multipliers = [0.5,1,2];
  var freq = temp[Math.floor(Math.random()*temp.length)] * multipliers[Math.floor(Math.random()*multipliers.length)];

  var sine = ac.createOscillator();
	sine.type = 'sawtooth';
	sine.frequency.value = freq;
	var gain = ac.createGain();
	sine.connect(gain);
	gain.connect(ac.destination);
	sine.start();
	// envelope
	var now = ac.currentTime;
	gain.gain.setValueAtTime(0,now);
  gain.gain.linearRampToValueAtTime(amp,now+0.005); gain.gain.linearRampToValueAtTime(0,now+0.405);
	// schedule cleanup
	setTimeout(function() {
		sine.stop();
		sine.disconnect(gain);
		gain.disconnect(ac.destination);
	},1000);
};

function generativeSaw(freq,amp) {
  if (!playBlue) return;
  bluePulse();
  var temp = [261.626,311.127,349.228,369.994,391.995,466.164];
  var freq = temp[Math.floor(Math.random()*temp.length)];
	var sine = ac.createOscillator();
	sine.type = 'sawtooth';
	sine.frequency.value = freq;
	var gain = ac.createGain();
	sine.connect(gain);
	gain.connect(ac.destination);
	sine.start();
	// envelope
	var now = ac.currentTime;
	gain.gain.setValueAtTime(0,now);
  gain.gain.linearRampToValueAtTime(amp,now+0.105);
  gain.gain.linearRampToValueAtTime(0,now+0.805);
	// schedule cleanup
	setTimeout(function() {
		sine.stop();
		sine.disconnect(gain);
		gain.disconnect(ac.destination);
	},1000);
};


/*! jQuery Color v@2.1.2 http://github.com/jquery/jquery-color | jquery.org/license */
(function(a,b){function m(a,b,c){var d=h[b.type]||{};return a==null?c||!b.def?null:b.def:(a=d.floor?~~a:parseFloat(a),isNaN(a)?b.def:d.mod?(a+d.mod)%d.mod:0>a?0:d.max<a?d.max:a)}function n(b){var c=f(),d=c._rgba=[];return b=b.toLowerCase(),l(e,function(a,e){var f,h=e.re.exec(b),i=h&&e.parse(h),j=e.space||"rgba";if(i)return f=c[j](i),c[g[j].cache]=f[g[j].cache],d=c._rgba=f._rgba,!1}),d.length?(d.join()==="0,0,0,0"&&a.extend(d,k.transparent),c):k[b]}function o(a,b,c){return c=(c+1)%1,c*6<1?a+(b-a)*c*6:c*2<1?b:c*3<2?a+(b-a)*(2/3-c)*6:a}var c="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",d=/^([\-+])=\s*(\d+\.?\d*)/,e=[{re:/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(a){return[a[1],a[2],a[3],a[4]]}},{re:/rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,parse:function(a){return[a[1]*2.55,a[2]*2.55,a[3]*2.55,a[4]]}},{re:/#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,parse:function(a){return[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]}},{re:/#([a-f0-9])([a-f0-9])([a-f0-9])/,parse:function(a){return[parseInt(a[1]+a[1],16),parseInt(a[2]+a[2],16),parseInt(a[3]+a[3],16)]}},{re:/hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,space:"hsla",parse:function(a){return[a[1],a[2]/100,a[3]/100,a[4]]}}],f=a.Color=function(b,c,d,e){return new a.Color.fn.parse(b,c,d,e)},g={rgba:{props:{red:{idx:0,type:"byte"},green:{idx:1,type:"byte"},blue:{idx:2,type:"byte"}}},hsla:{props:{hue:{idx:0,type:"degrees"},saturation:{idx:1,type:"percent"},lightness:{idx:2,type:"percent"}}}},h={"byte":{floor:!0,max:255},percent:{max:1},degrees:{mod:360,floor:!0}},i=f.support={},j=a("<p>")[0],k,l=a.each;j.style.cssText="background-color:rgba(1,1,1,.5)",i.rgba=j.style.backgroundColor.indexOf("rgba")>-1,l(g,function(a,b){b.cache="_"+a,b.props.alpha={idx:3,type:"percent",def:1}}),f.fn=a.extend(f.prototype,{parse:function(c,d,e,h){if(c===b)return this._rgba=[null,null,null,null],this;if(c.jquery||c.nodeType)c=a(c).css(d),d=b;var i=this,j=a.type(c),o=this._rgba=[];d!==b&&(c=[c,d,e,h],j="array");if(j==="string")return this.parse(n(c)||k._default);if(j==="array")return l(g.rgba.props,function(a,b){o[b.idx]=m(c[b.idx],b)}),this;if(j==="object")return c instanceof f?l(g,function(a,b){c[b.cache]&&(i[b.cache]=c[b.cache].slice())}):l(g,function(b,d){var e=d.cache;l(d.props,function(a,b){if(!i[e]&&d.to){if(a==="alpha"||c[a]==null)return;i[e]=d.to(i._rgba)}i[e][b.idx]=m(c[a],b,!0)}),i[e]&&a.inArray(null,i[e].slice(0,3))<0&&(i[e][3]=1,d.from&&(i._rgba=d.from(i[e])))}),this},is:function(a){var b=f(a),c=!0,d=this;return l(g,function(a,e){var f,g=b[e.cache];return g&&(f=d[e.cache]||e.to&&e.to(d._rgba)||[],l(e.props,function(a,b){if(g[b.idx]!=null)return c=g[b.idx]===f[b.idx],c})),c}),c},_space:function(){var a=[],b=this;return l(g,function(c,d){b[d.cache]&&a.push(c)}),a.pop()},transition:function(a,b){var c=f(a),d=c._space(),e=g[d],i=this.alpha()===0?f("transparent"):this,j=i[e.cache]||e.to(i._rgba),k=j.slice();return c=c[e.cache],l(e.props,function(a,d){var e=d.idx,f=j[e],g=c[e],i=h[d.type]||{};if(g===null)return;f===null?k[e]=g:(i.mod&&(g-f>i.mod/2?f+=i.mod:f-g>i.mod/2&&(f-=i.mod)),k[e]=m((g-f)*b+f,d))}),this[d](k)},blend:function(b){if(this._rgba[3]===1)return this;var c=this._rgba.slice(),d=c.pop(),e=f(b)._rgba;return f(a.map(c,function(a,b){return(1-d)*e[b]+d*a}))},toRgbaString:function(){var b="rgba(",c=a.map(this._rgba,function(a,b){return a==null?b>2?1:0:a});return c[3]===1&&(c.pop(),b="rgb("),b+c.join()+")"},toHslaString:function(){var b="hsla(",c=a.map(this.hsla(),function(a,b){return a==null&&(a=b>2?1:0),b&&b<3&&(a=Math.round(a*100)+"%"),a});return c[3]===1&&(c.pop(),b="hsl("),b+c.join()+")"},toHexString:function(b){var c=this._rgba.slice(),d=c.pop();return b&&c.push(~~(d*255)),"#"+a.map(c,function(a){return a=(a||0).toString(16),a.length===1?"0"+a:a}).join("")},toString:function(){return this._rgba[3]===0?"transparent":this.toRgbaString()}}),f.fn.parse.prototype=f.fn,g.hsla.to=function(a){if(a[0]==null||a[1]==null||a[2]==null)return[null,null,null,a[3]];var b=a[0]/255,c=a[1]/255,d=a[2]/255,e=a[3],f=Math.max(b,c,d),g=Math.min(b,c,d),h=f-g,i=f+g,j=i*.5,k,l;return g===f?k=0:b===f?k=60*(c-d)/h+360:c===f?k=60*(d-b)/h+120:k=60*(b-c)/h+240,h===0?l=0:j<=.5?l=h/i:l=h/(2-i),[Math.round(k)%360,l,j,e==null?1:e]},g.hsla.from=function(a){if(a[0]==null||a[1]==null||a[2]==null)return[null,null,null,a[3]];var b=a[0]/360,c=a[1],d=a[2],e=a[3],f=d<=.5?d*(1+c):d+c-d*c,g=2*d-f;return[Math.round(o(g,f,b+1/3)*255),Math.round(o(g,f,b)*255),Math.round(o(g,f,b-1/3)*255),e]},l(g,function(c,e){var g=e.props,h=e.cache,i=e.to,j=e.from;f.fn[c]=function(c){i&&!this[h]&&(this[h]=i(this._rgba));if(c===b)return this[h].slice();var d,e=a.type(c),k=e==="array"||e==="object"?c:arguments,n=this[h].slice();return l(g,function(a,b){var c=k[e==="object"?a:b.idx];c==null&&(c=n[b.idx]),n[b.idx]=m(c,b)}),j?(d=f(j(n)),d[h]=n,d):f(n)},l(g,function(b,e){if(f.fn[b])return;f.fn[b]=function(f){var g=a.type(f),h=b==="alpha"?this._hsla?"hsla":"rgba":c,i=this[h](),j=i[e.idx],k;return g==="undefined"?j:(g==="function"&&(f=f.call(this,j),g=a.type(f)),f==null&&e.empty?this:(g==="string"&&(k=d.exec(f),k&&(f=j+parseFloat(k[2])*(k[1]==="+"?1:-1))),i[e.idx]=f,this[h](i)))}})}),f.hook=function(b){var c=b.split(" ");l(c,function(b,c){a.cssHooks[c]={set:function(b,d){var e,g,h="";if(d!=="transparent"&&(a.type(d)!=="string"||(e=n(d)))){d=f(e||d);if(!i.rgba&&d._rgba[3]!==1){g=c==="backgroundColor"?b.parentNode:b;while((h===""||h==="transparent")&&g&&g.style)try{h=a.css(g,"backgroundColor"),g=g.parentNode}catch(j){}d=d.blend(h&&h!=="transparent"?h:"_default")}d=d.toRgbaString()}try{b.style[c]=d}catch(j){}}},a.fx.step[c]=function(b){b.colorInit||(b.start=f(b.elem,c),b.end=f(b.end),b.colorInit=!0),a.cssHooks[c].set(b.elem,b.start.transition(b.end,b.pos))}})},f.hook(c),a.cssHooks.borderColor={expand:function(a){var b={};return l(["Top","Right","Bottom","Left"],function(c,d){b["border"+d+"Color"]=a}),b}},k=a.Color.names={aqua:"#00ffff",black:"#000000",blue:"#0000ff",fuchsia:"#ff00ff",gray:"#808080",green:"#008000",lime:"#00ff00",maroon:"#800000",navy:"#000080",olive:"#808000",purple:"#800080",red:"#ff0000",silver:"#c0c0c0",teal:"#008080",white:"#ffffff",yellow:"#ffff00",transparent:[null,null,null,0],_default:"#ffffff"}})(jQuery);

/*

var theSoundBuffer = null;

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  // Decode asynchronously
  request.onload = function() {
    var audioData = request.response;
    ac.decodeAudioData(audioData, function(buffer) {
      theSoundBuffer = buffer;
    }, onError);
  }
  request.send();
}

function playSound(buffer) {
  var source = ac.createBufferSource();     // creates a sound source
  source.buffer = theSoundBuffer;                    // tell the source which sound to play
  source.connect(ac.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now                                             // note: on older systems, may have to use deprecated noteOn(time);
}

onError = function(){ console.log('Problems Encountered'); }

// make AudioBufferSource Node
// connect to gain object
// make AudioBufferSourceNode go
// make envelope go.

//loadSound('samples/Whistle/Whistle1.wav');
loadSound('samples/RockScrape10.wav');

function rockScrape(){
  playSound();
}*/
