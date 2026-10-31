var Z=`
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uR;
uniform float uTime;
uniform float uIntro;
uniform float uBeam;
uniform float uFocus;
uniform float uFlow;
uniform float uWord;
uniform float uFade;
uniform float uDpr;
uniform float uBand;
uniform sampler2D uText;

const float TAU = 6.28318530718;
const float PI = 3.14159265359;
float px;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// \u70B9\u8D28\u91CF\u900F\u955C\uFF1A\u50CF\u5E73\u9762\u504F\u79FB d \u2192 \u6E90\u5E73\u9762\u504F\u79FB
vec2 lens(vec2 d, float e) {
  return d * (1. - e * e / max(dot(d, d), 1e-7));
}

// \u4E00\u5C42\u661F\uFF1A\u6BCF\u683C\u81F3\u591A\u4E00\u9897\uFF0C\u5BBD\u5EA6\u4E0D\u5C0F\u4E8E\u4E00\u4E2A\u8BBE\u5907\u50CF\u7D20\u5728\u6E90\u5E73\u9762\u4E0A\u7684\u6295\u5F71\uFF0C\u907F\u514D\u900F\u955C\u538B\u7F29\u5904\u95EA\u70C1
float starLayer(vec2 s, float fw, float scale, float density, float gain, float drift) {
  s.x += uTime * drift;
  vec2 g = s * scale;
  vec2 id = floor(g);
  vec2 h = hash22(id);
  if (h.x > density) return 0.;
  vec2 o = (hash22(id + 19.19) - .5) * .7;
  float dist = length(fract(g) - .5 - o) / scale;
  float s0 = px * .62;
  float sg = max(s0, fw * .55);
  float b = (.05 + pow(h.y, 8.) * gain) * (s0 * s0) / (sg * sg);
  b *= .82 + .18 * sin(uTime * (.4 + 2.2 * h.y) + h.x * 57.);
  return b * exp(-.5 * dist * dist / (sg * sg));
}

// \u5B57\u6807\u5E26\uFF1A\u6E90\u5E73\u9762\u4E0A\u4EE5\u900F\u955C\u4E2D\u5FC3\u4E3A\u8F74\u7684\u4E00\u6761\u6A2A\u5E26\uFF0C\u6A2A\u5411\u5FAA\u73AF\u6D41\u52A8
float word(vec2 s, float bandY, float bandH, float bias) {
  float v = (s.y - bandY) / bandH + .5;
  float u = s.x / (bandH * 4.) + uFlow;
  float a = TEX(uText, vec2(u, 1. - clamp(v, 0., 1.)), bias).a;
  return a * step(0., v) * step(v, 1.);
}

void main() {
  px = 1. / uRes.y;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) * px;
  vec2 d = p - uCenter;
  float r = length(d);
  float R = uR;
  float E = R * (1.42 + .04 * uFocus);
  float intro = uIntro;

  vec2 s = lens(d, E);
  float fw = length(fwidth(s)) * .7071;
  float shadow = smoothstep(R - px * 1.25, R + px * .35, r);

  // \u661F\u7A7A
  vec2 sky = s + uCenter;
  float st = starLayer(sky, fw, 66., .17, .8, .0011)
           + starLayer(sky + 3.17, fw, 27., .2, 1.5, .0019)
           + starLayer(sky + 7.71, fw, 9.5, .24, 2.8, .003);
  vec3 col = vec3(.86, .9, 1.) * st * shadow * smoothstep(0., .5, intro);

  // \u5B57\u6807\uFF1A\u4E09\u4E2A\u901A\u9053\u7528\u7565\u6709\u5DEE\u5F02\u7684\u900F\u955C\u5F3A\u5EA6\u91C7\u6837\uFF0C\u5728\u5F3A\u5F2F\u66F2\u5904\u5F62\u6210\u6781\u7EC6\u7684\u8272\u6563\u8FB9
  float ax = abs(p.x) / (.5 * uRes.x * px);
  float blur = smoothstep(.1, .9, ax) * 4. + uFade * 2.5;
  float bandH = R * uBand;
  float bandY = -R * .05;
  float k = .0028 + .0045 * uFocus;
  float tg = word(s, bandY, bandH, blur);
  float tr = word(lens(d, E * (1. + k)), bandY, bandH, blur);
  float tb = word(lens(d, E * (1. - k)), bandY, bandH, blur);
  // \u5C4F\u5E55\u7A7A\u95F4\u7684\u7EC6\u6A2A\u7EB9\uFF0C\u50CF\u8FDC\u5904\u63A5\u6536\u5230\u7684\u4FE1\u53F7\uFF1B\u6A21\u7CCA\u5904\u9010\u6E10\u6D88\u5931
  float ly = gl_FragCoord.y / (2.5 * uDpr);
  float tri = abs(fract(ly) - .5) * 2.;
  float ln = smoothstep(.22, .42, tri);
  float lines = mix(1., .45 + .55 * ln, 1. - smoothstep(.2, 2.2, blur));
  // \u9634\u5F71\u4E0E\u7231\u56E0\u65AF\u5766\u73AF\u4E4B\u95F4\u7684\u5012\u7F6E\u6B21\u7EA7\u50CF\u538B\u5F97\u5F88\u6697\uFF0C\u53EA\u7559\u4E0B\u73AF\u5916\u7684\u4E3B\u50CF\u5149\u5F27
  float outer = smoothstep(E * .9, E * 1.08, r);
  float edge = 1. - smoothstep(.58, 1., ax);
  float tAmt = .34 * uWord * smoothstep(.5, 1., intro) * edge * mix(.12, 1., outer) * lines * shadow;
  col += vec3(tr, tg, tb) * vec3(.8, .81, .84) * tAmt;

  // \u5149\u5B50\u73AF
  float ang = atan(d.y, d.x);
  float lobe = pow(.5 + .5 * cos(ang - uBeam), 3.);
  float w = max(R * .0055, px * .85);
  float core = exp(-pow((r - R * 1.004) / w, 2.));
  float halo = exp(-max(r - R, 0.) / (R * .085)) * step(R, r);
  float bleed = exp(-max(R - r, 0.) / (R * .02)) * (1. - step(R, r));
  // \u5F00\u573A\uFF1A\u4ECE\u6697\u4FA7\u6CBF\u4E24\u8FB9\u540C\u65F6\u70B9\u4EAE\uFF0C\u5728\u4EAE\u4FA7\u4F1A\u5408
  float sw = smoothstep(.16, .74, intro) * 1.06;
  float q = abs(mod(ang - uBeam, TAU) - PI) / PI;
  float drawn = 1. - smoothstep(sw - .025, sw + .002, q);
  float head = exp(-pow((q - sw) / .018, 2.)) * (1. - smoothstep(.96, 1.06, sw));
  float ringI = (core * (.2 + 1.75 * lobe) + halo * (.035 + .3 * lobe) + bleed * .22 * lobe) * drawn;
  ringI += head * exp(-pow((r - R * 1.004) / (w * 1.8), 2.)) * 2.4;
  ringI += exp(-pow((intro - .76) / .045, 2.)) * lobe * halo * .5;
  col += vec3(1., .985, .96) * ringI;

  // \u4EAE\u4FA7\u4E00\u9053\u6781\u7EC6\u7684\u6A2A\u5411\u5149\u75D5
  vec2 fd = p - (uCenter + R * vec2(cos(uBeam), sin(uBeam)));
  float flare = exp(-abs(fd.y) / (px * 1.2 + R * .003)) * exp(-abs(fd.x) / (R * 2.4));
  col += vec3(.88, .92, 1.) * flare * .035 * shadow * smoothstep(.7, 1., intro) * (.7 + .3 * uFocus);

  col = 1. - exp(-col * 1.15);
  col *= (1. - .45 * smoothstep(.35, 1.05, length(p * vec2(.62, 1.)))) * (1. - .88 * uFade);
  col += (hash12(gl_FragCoord.xy + fract(uTime * 7.) * 91.) - .5) / 255.;
  FRAG = vec4(col, 1.);
}`;function rt(e,s){if(e)return[`#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0., 1.); }`,`#version 300 es
precision highp float;
out vec4 outColor;
#define TEX texture
#define FRAG outColor
${Z}`];let o=Z;return s||(o=o.replace(/fwidth\(s\)/g,"vec2(px * 2.)").replace(/fwidth\(ly\)/g,"0.34")),[`attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0., 1.); }`,`${s?`#extension GL_OES_standard_derivatives : enable
`:""}precision highp float;
#define TEX texture2D
#define FRAG gl_FragColor
${o}`]}function nt(e,[s,o]){let a=e.createProgram();for(let[u,d]of[[e.VERTEX_SHADER,s],[e.FRAGMENT_SHADER,o]]){let t=e.createShader(u);if(e.shaderSource(t,d),e.compileShader(t),!e.getShaderParameter(t,e.COMPILE_STATUS))return console.warn("cosmos shader",e.getShaderInfoLog(t)),null;e.attachShader(a,t)}return e.linkProgram(a),e.getProgramParameter(a,e.LINK_STATUS)?a:(console.warn("cosmos program",e.getProgramInfoLog(a)),null)}async function it(e){let s=await(await fetch(e)).text(),o=/viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"/.exec(s),a=o?Number(o[1])/Number(o[2]):157.86/34,u=s.replace("<svg ",`<svg width="${Math.round(340*a)}" height="340" `),d=URL.createObjectURL(new Blob([u],{type:"image/svg+xml"})),t=new Image;t.src=d;try{await t.decode()}finally{URL.revokeObjectURL(d)}let f=document.createElement("canvas");f.width=1024,f.height=256;let v=f.getContext("2d"),h=150,g=h*a;return v.drawImage(t,(f.width-g)/2,(f.height-h)/2,g,h),f}var k=(e,s,o)=>Math.min(o,Math.max(s,e));function tt(e,{motion:s,shared:o,onFirstFrame:a}){let u=document.documentElement,d={alpha:!1,antialias:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,powerPreference:"default"},t=e.getContext("webgl2",d),f=!!t;if(t||(t=e.getContext("webgl",d)),!t)return u.classList.add("no-gl"),!1;let v=f||!!t.getExtension("OES_standard_derivatives"),h=nt(t,rt(f,v));if(!h)return u.classList.add("no-gl"),!1;t.useProgram(h),t.bindBuffer(t.ARRAY_BUFFER,t.createBuffer()),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let g=t.getAttribLocation(h,"aPos");t.enableVertexAttribArray(g),t.vertexAttribPointer(g,2,t.FLOAT,!1,0,0);let y={};for(let x of["uRes","uCenter","uR","uTime","uIntro","uBeam","uFocus","uFlow","uWord","uFade","uDpr","uBand","uText"])y[x]=t.getUniformLocation(h,x);let r=t.createTexture();t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array(4)),t.uniform1i(y.uText,0);let i=0;it(e.dataset.wordmark).then(x=>{t.bindTexture(t.TEXTURE_2D,r),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,x),t.generateMipmap(t.TEXTURE_2D),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR_MIPMAP_LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let E=t.getExtension("EXT_texture_filter_anisotropic");E&&t.texParameterf(t.TEXTURE_2D,E.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(8,t.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT))),i=performance.now(),s||B(performance.now())}).catch(()=>{});let w=e.closest("[data-hero]")??e.parentElement,c={w:1,h:1,R:.105,cy:.1,band:1.9,dpr:1,scale:1},R=()=>{let x=e.getBoundingClientRect();c.w=Math.max(1,x.width),c.h=Math.max(1,x.height);let E=Math.min(window.devicePixelRatio||1,2)*c.scale,I=c.w*E,P=c.h*E,D=39e5;if(I*P>D){let F=Math.sqrt(D/(I*P));I*=F,P*=F}e.width=Math.max(1,Math.round(I)),e.height=Math.max(1,Math.round(P)),c.dpr=e.height/c.h;let X=c.w/c.h,q=c.w<680;c.R=q?Math.min(.082,X*.19):Math.min(.105,X*.16),c.band=q?1.55:1.9,c.cy=q?.2:.1},p={x:0,y:0,inside:!1},b={x:0,y:0,vx:0,vy:0},n=[Math.cos(.72),Math.sin(.72)],l=0;s&&(w.addEventListener("pointermove",x=>{if(x.pointerType!=="mouse")return;let E=e.getBoundingClientRect();p.x=(x.clientX-E.left-E.width/2)/E.height,p.y=-(x.clientY-E.top-E.height/2)/E.height,p.inside=!0},{passive:!0}),w.addEventListener("pointerleave",()=>p.inside=!1));let m=0,T=0,S=0,C=.12,L=0,A=!0,z=!0,O=0,Y=0;function B(x){let E=T?Math.min(.05,(x-T)/1e3):.016666666666666666;if(T=x,m||(m=x),s){S+=E,C+=E*.018;let D=p.inside?k(p.x*.04,-.028,.028):0,X=p.inside?k((p.y-c.cy)*.04,-.02,.02):0,q=26,F=2*Math.sqrt(q)*.92;b.vx+=((D-b.x)*q-b.vx*F)*E,b.vy+=((X-b.y)*q-b.vy*F)*E,b.x+=b.vx*E,b.y+=b.vy*E,l+=((p.inside?1:0)-l)*(1-Math.exp(-E*2.2));let V=.72+.32*Math.sin(S*.06),W=Math.cos(V),$=Math.sin(V);if(p.inside){let K=p.x-b.x,J=p.y-(c.cy+b.y),Q=Math.hypot(K,J)||1;W+=(K/Q-W)*.85,$+=(J/Q-$)*.85}let j=1-Math.exp(-E*3);n=[n[0]+(W-n[0])*j,n[1]+($-n[1])*j]}else S=40;let I=s?k((x-m)/3400,0,1):1,P=i?s?k((x-i)/1200,0,1):1:0;t.viewport(0,0,e.width,e.height),t.uniform2f(y.uRes,e.width,e.height),t.uniform2f(y.uCenter,b.x,c.cy+b.y),t.uniform1f(y.uR,c.R*(1+.18*o.heroProgress)),t.uniform1f(y.uTime,S),t.uniform1f(y.uIntro,I),t.uniform1f(y.uBeam,Math.atan2(n[1],n[0])),t.uniform1f(y.uFocus,l),t.uniform1f(y.uFlow,C),t.uniform1f(y.uWord,P*P*(3-2*P)),t.uniform1f(y.uFade,o.heroProgress),t.uniform1f(y.uDpr,c.dpr),t.uniform1f(y.uBand,c.band),t.drawArrays(t.TRIANGLES,0,3),z&&(z=!1,e.classList.add("is-ready"),a?.()),s&&c.scale>.56&&(Y++,E>.022&&O++,Y>=90&&(O>45&&(c.scale=Math.max(.55,c.scale*.82),R()),Y=0,O=0))}let at=x=>{L=0,B(x),U()};function U(){!s||L||!A||document.hidden||(L=requestAnimationFrame(at))}let G=()=>{cancelAnimationFrame(L),L=0,T=0};return new IntersectionObserver(([x])=>{A=x.isIntersecting,A?U():G()}).observe(w),new ResizeObserver(()=>{R(),s||B(performance.now())}).observe(e),document.addEventListener("visibilitychange",()=>document.hidden?G():U()),e.addEventListener("webglcontextlost",x=>{x.preventDefault(),G(),A=!1,e.classList.remove("is-ready"),u.classList.add("no-gl")}),R(),s?U():B(performance.now()),!0}var N=document.documentElement,_=N.classList.contains("js-motion"),M=e=>new Promise(s=>setTimeout(s,e)),st={heroProgress:0};function H(e,s,{threshold:o=.25,rootMargin:a="0px"}={}){let u=new IntersectionObserver(([d])=>s(d.isIntersecting),{threshold:o,rootMargin:a});return u.observe(e),u}function ot(e,s=()=>!0){return async o=>{let a=o,u=performance.now();for(;a>0;){if(await M(Math.min(80,a)),!s())return!1;let d=performance.now();e()&&(a-=d-u),u=d}return s()}}lt();dt();ft();ut();ht();pt();mt();gt();yt();var et=document.querySelector("[data-cosmos]"),ct=et?tt(et,{motion:_,shared:st,onFirstFrame:()=>N.classList.add("intro")}):!1;ct||N.classList.add("intro");N.classList.add("motion-ready");function lt(){let e=document.querySelector("[data-header]");if(!e)return;let s=!1,o=()=>{s=!1,e.toggleAttribute("data-scrolled",scrollY>8)};addEventListener("scroll",()=>{s||(s=!0,requestAnimationFrame(o))},{passive:!0}),o();let a=new Map([...document.querySelectorAll("[data-nav]")].map(f=>[f.dataset.nav,f])),u=[...a.keys()].map(f=>document.getElementById(f)).filter(Boolean),d=new Map,t=new IntersectionObserver(f=>{for(let h of f)d.set(h.target.id,h.isIntersecting?h.intersectionRatio:0);let v=null;for(let[h,g]of d)g>0&&(!v||g>d.get(v))&&(v=h);for(let[h,g]of a)g.classList.toggle("is-current",h===v)},{threshold:[0,.25,.5],rootMargin:"-30% 0px -50% 0px"});u.forEach(f=>t.observe(f))}function dt(){for(let o of document.querySelectorAll("[data-stagger]"))[...o.children].forEach((a,u)=>a.style.setProperty("--i",u));let e=document.querySelectorAll("[data-reveal], [data-section]");if(!_){e.forEach(o=>o.classList.add("is-visible"));return}let s=new IntersectionObserver(o=>{for(let a of o)a.isIntersecting&&(a.target.classList.add("is-visible"),s.unobserve(a.target))},{threshold:.12,rootMargin:"0px 0px -8% 0px"});e.forEach(o=>s.observe(o))}function ft(){let e=document.querySelector("[data-hero]");if(!e||!_)return;let s=!1,o=()=>{s=!1;let a=Math.min(1,Math.max(0,scrollY/(e.offsetHeight*.85)));st.heroProgress=a,e.style.setProperty("--hero-p",a.toFixed(4))};addEventListener("scroll",()=>{s||(s=!0,requestAnimationFrame(o))},{passive:!0}),addEventListener("resize",o),o()}function ut(){let e=document.querySelector("[data-showcase]");if(!e)return;let s=[...e.querySelectorAll("[data-tab]")],o=e.querySelector(".window-main"),a=[...e.querySelectorAll("[data-agent] [data-phase]")],u=e.querySelector(".run-step.is-approval"),d=u.querySelector("[data-approve]"),t=u.querySelector("[data-approved]"),f=t.textContent,v=[...e.querySelectorAll(".chip")],h=[4200,5200,5800,5600];s.forEach((l,m)=>l.style.setProperty("--dur",`${h[m]}ms`));let g=l=>s.forEach((m,T)=>{m.classList.toggle("is-active",T===l),T===l?m.setAttribute("aria-current","step"):m.removeAttribute("aria-current")}),y=l=>{u.classList.toggle("is-approved",l),d.classList.remove("is-pressed"),t.textContent=l?t.dataset.approved:f};if(!_){a.forEach(l=>l.classList.add("is-shown")),y(!0),v.forEach(l=>l.classList.add("is-lit")),s.forEach((l,m)=>l.addEventListener("click",()=>g(m)));return}let r=0,i=-1,w=!1,c=!1,R=()=>w&&!c&&!document.hidden,p=()=>e.classList.toggle("is-paused",!R()),b=l=>{let m=l.querySelector(".tab-bar i");m.style.animation="none",m.offsetWidth,m.style.animation=""};async function n(l,{reset:m=!1}={}){let T=++r,S=ot(R,()=>T===r);if(m&&(o.classList.add("is-resetting"),await M(480),T!==r||(a.forEach(L=>L.classList.remove("is-shown","is-current")),y(!1),v.forEach(L=>L.classList.remove("is-lit")),o.classList.remove("is-resetting"),await M(200),T!==r)))return;i=l,g(l),b(s[l]);for(let L of a)L.classList.toggle("is-shown",Number(L.dataset.phase)<l),L.classList.remove("is-current");y(l>2),v.forEach(L=>L.classList.remove("is-lit"));let C=a.filter(L=>Number(L.dataset.phase)===l);for(let[L,A]of C.entries()){if(!await S(L===0?260:480))return;if(A.classList.add("is-shown"),!!A.classList.contains("run-step")){if(A.classList.add("is-current"),A===u){if(!await S(1700)||(d.classList.add("is-pressed"),!await S(240)))return;y(!0)}else if(!await S(A.classList.contains("is-done")?520:940))return;A.classList.remove("is-current")}}if(l===3)for(let L of v){if(!await S(200))return;L.classList.add("is-lit")}}s.forEach((l,m)=>{l.querySelector(".tab-bar i").addEventListener("animationend",()=>{m===i&&(m===s.length-1?n(0,{reset:!0}):n(m+1))}),l.addEventListener("click",()=>{m!==i&&n(m)})}),H(e,l=>{w=l,p(),l&&i<0&&n(0)},{threshold:.35}),e.addEventListener("pointerenter",()=>{c=!0,p()}),e.addEventListener("pointerleave",()=>{c=!1,p()}),document.addEventListener("visibilitychange",p),p()}function ht(){let e=document.querySelector("[data-phone]");if(!e)return;let s=e.querySelector(".phone"),o=[...e.querySelectorAll("[data-at]")],a=e.querySelector(".p-status"),u=e.querySelector("[data-status]"),d=u.textContent,t=e.querySelector("[data-yes]"),f=e.querySelector("[data-lock-time]"),v=[...e.querySelectorAll("[data-story]")],h=n=>v.forEach((l,m)=>{l.classList.toggle("is-active",m===n),l.classList.toggle("is-past",m<n)}),g=n=>o.filter(l=>Number(l.dataset.at)===n);if(!_){o.forEach(n=>n.classList.add("is-shown")),a.classList.add("is-done"),u.textContent=u.dataset.done,h(4);return}let y=!1,r=!1,i=ot(()=>y&&!document.hidden),[w,c]=f.dataset.from.split(":").map(Number),[,R]=f.dataset.to.split(":").map(Number),p=n=>String(n).padStart(2,"0");async function b(){if(!r)for(r=!0;;){s.classList.remove("is-away"),o.forEach(n=>n.classList.remove("is-shown")),a.classList.remove("is-done"),u.textContent=d,f.textContent=f.dataset.from,h(-1),await i(900),h(0);for(let n of g(0))n.classList.add("is-shown"),await i(420);await i(1300),h(1),g(1).forEach(n=>n.classList.add("is-shown")),await i(2300),h(2),g(2).forEach(n=>n.classList.add("is-shown")),await i(1700),t.classList.add("is-pressed"),await i(260),t.classList.remove("is-pressed"),await i(900),h(3),s.classList.add("is-away"),await i(900);for(let n=c;n<=R;n++)f.textContent=`${p(w)}:${p(n)}`,await i(n===R?0:46);await i(1100),h(4),s.classList.remove("is-away"),await i(600),a.classList.add("is-done"),u.textContent=u.dataset.done,g(4).forEach(n=>n.classList.add("is-shown")),await i(4600)}}H(e,n=>{y=n,n&&b()},{threshold:.35})}function pt(){let e=document.querySelector("[data-graph]");if(!e)return;let s=e.querySelector(".graph-svg"),o=[...s.querySelectorAll(".edge")],a=new Map([...s.querySelectorAll(".node")].map(r=>[r.dataset.node,r])),u=new Map([...document.querySelectorAll("[data-package]")].map(r=>[r.dataset.package,r])),d={};o.forEach(r=>{var i;return(d[i=r.dataset.from]??(d[i]=[])).push(r.dataset.to)});for(let r of a.values())r.style.setProperty("--layer",r.dataset.layer);for(let r of o){let i=r.getTotalLength();r.dataset.length=i,r.style.setProperty("--layer",r.dataset.layer),r.style.strokeDasharray=`${i}`,r.style.strokeDashoffset=_?`${i}`:"0"}let t=r=>{s.classList.toggle("has-focus",!!r);let i=new Set(r?d[r]??[]:[]);for(let[w,c]of a)c.classList.toggle("is-on",w===r),c.classList.toggle("is-dep",i.has(w));o.forEach(w=>w.classList.toggle("is-on",w.dataset.from===r))};for(let[r,i]of a)i.addEventListener("pointerenter",()=>t(r)),i.addEventListener("focus",()=>t(r)),i.addEventListener("pointerleave",()=>t(null)),i.addEventListener("blur",()=>t(null));if(!_){e.classList.add("is-built","is-settled");return}let f=s.querySelector(".pulse"),v=!1,h=r=>new Promise(i=>{let w=Number(r.dataset.length),c=420+w*1.6,R=performance.now(),p=b=>{let n=Math.min(1,(b-R)/c),l=n<.5?2*n*n:1-(-2*n+2)**2/2,m=r.getPointAtLength(l*w);f.setAttribute("cx",m.x),f.setAttribute("cy",m.y),n<1?requestAnimationFrame(p):i()};requestAnimationFrame(p)});async function g(){for(;;){for(;!v||document.hidden||s.classList.contains("has-focus");)await M(400);let r="ui",i=!0;for(;d[r]?.length;){let w=d[r][Math.floor(Math.random()*d[r].length)],c=o.find(p=>p.dataset.from===r&&p.dataset.to===w);if(i){let p=c.getPointAtLength(0);f.setAttribute("cx",p.x),f.setAttribute("cy",p.y),f.style.transition="opacity .4s",f.style.opacity="0.9",i=!1}c.classList.add("is-flow"),await h(c),c.classList.remove("is-flow");let R=a.get(w);R.classList.add("is-hit"),setTimeout(()=>R.classList.remove("is-hit"),700),r=w}f.style.opacity="0",await M(2600+Math.random()*2200)}}let y=!1;H(e,r=>{v=r,!(!r||y)&&(y=!0,e.classList.add("is-built"),setTimeout(()=>{e.classList.add("is-settled"),g()},2300))},{threshold:.3})}function mt(){let e=document.querySelector("[data-typing]");if(!e)return;if(!_){e.classList.add("is-typed");return}let s=[...e.querySelectorAll(".code-line")],o=s.map(d=>d.querySelector("[data-cmd]")),a=o.map(d=>d?.innerHTML??"");o.forEach(d=>d&&(d.textContent=""));let u=!1;H(e,async d=>{if(!(!d||u)){u=!0,await M(500);for(let[t,f]of s.entries()){f.classList.add("is-started");let v=o[t];if(!v)break;f.classList.add("is-typing");let h=v.dataset.cmd;for(let g=1;g<=h.length;g++)v.textContent=h.slice(0,g),await M(h[g-1]===" "?46:14+Math.random()*30);await M(260),v.innerHTML=a[t],f.classList.remove("is-typing"),await M(300)}e.classList.add("is-typed")}},{threshold:.5})}function gt(){for(let e of document.querySelectorAll("[data-copy]")){let s=e.querySelector("span"),o=s.textContent;e.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e.dataset.copy)}catch{let a=document.createRange();a.selectNodeContents(document.querySelector("[data-sha]")),getSelection().removeAllRanges(),getSelection().addRange(a);return}s.textContent=e.dataset.copied,e.classList.add("is-done"),setTimeout(()=>{s.textContent=o,e.classList.remove("is-done")},1800)})}}async function yt(){let e=document.querySelector("[data-download]"),s=e?.querySelector("[data-download-hint]");if(!s)return;let o=navigator.userAgent,a=null;if(/Windows/.test(o))a="windows";else if(/Android|iPhone|iPod|iPad/.test(o)||/Macintosh/.test(o)&&navigator.maxTouchPoints>1)a="mobile";else if(/Macintosh/.test(o)&&navigator.userAgentData?.getHighEntropyValues)try{let{architecture:u}=await navigator.userAgentData.getHighEntropyValues(["architecture"]);u==="x86"&&(a="intel")}catch{}a&&(s.textContent=e.dataset[`hint${a[0].toUpperCase()}${a.slice(1)}`],s.hidden=!1)}
