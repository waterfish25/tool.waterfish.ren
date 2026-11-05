(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var groups=[
{label:'图片工具',tools:[
{id:'image.convert',name:'图片格式转换',path:'/Image/ImageConvert',tag:'IMG'},
{id:'image.compress',name:'图片压缩',path:'/Image/ImageCompress',tag:'ZIP'},
{id:'image.resize',name:'图片尺寸调整',path:'/Image/ImageResize',tag:'SIZE'},
{id:'image.base64',name:'图片 Base64',path:'/Image/ImageBase64',tag:'B64'}
]},
{label:'JSON 工具',tools:[
{id:'json.format',name:'JSON 格式化',path:'/JSON/JSONFormat',tag:'JSON'}
]},
{label:'开发工具',tools:[
{id:'dev.time',name:'时间戳转换',path:'/Dev/TimeConvert',tag:'TIME'},
{id:'dev.color',name:'颜色转换',path:'/Dev/ColorConvert',tag:'RGB'},
{id:'dev.password',name:'密码生成',path:'/Dev/PasswordGenerator',tag:'KEY'},
{id:'dev.url',name:'URL 编解码',path:'/Dev/UrlCodec',tag:'URL'}
]}
];
var current=document.body.getAttribute('data-tool')||'';
var side=document.getElementById('sidebar');
if(side){
var nav='';
groups.forEach(function(g){
nav+='<div class="nav-group"><div class="nav-label">'+g.label+'</div>';
g.tools.forEach(function(t){
nav+='<a class="nav-item'+(t.id===current?' active':'')+'" href="'+t.path+'"><span>'+t.name+'</span></a>';
});
nav+='</div>';
});
side.innerHTML='<div class="brand"><a class="brand-logo" href="https://waterfish.ren" aria-label="水鱼之家"><img src="/favicon.ico" alt="水鱼之家"></a><a class="brand-name" href="https://waterfish.ren">水鱼之家</a><span class="brand-sep">/</span><a class="brand-page" href="/">工具</a></div><nav class="nav">'+nav+'</nav><div class="side-foot"><a href="https://waterfish.ren">返回水鱼之家</a><span class="side-note">所有处理均在浏览器本地完成，文件不会上传。</span></div>';
}
var toastEl=document.getElementById('toast');
var toastTimer=null;
function toast(msg){
if(!toastEl)return;
toastEl.textContent=msg;
toastEl.classList.add('show');
clearTimeout(toastTimer);
toastTimer=setTimeout(function(){toastEl.classList.remove('show')},1800);
}
function esc(s){
return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});
}
function formatBytes(n){
if(!n&&n!==0)return '-';
if(n<1024)return n+' B';
if(n<1048576)return (n/1024).toFixed(1)+' KB';
return (n/1048576).toFixed(2)+' MB';
}
function extFor(mime){
return {'image/png':'png','image/jpeg':'jpg','image/webp':'webp'}[mime]||'img';
}
function baseName(name){
return String(name).replace(/\.[^.]+$/,'');
}
function loadImg(file){
return new Promise(function(res,rej){
var url=URL.createObjectURL(file);
var img=new Image();
img.onload=function(){URL.revokeObjectURL(url);res(img)};
img.onerror=function(){URL.revokeObjectURL(url);rej(new Error('无法读取图片'))};
img.src=url;
});
}
function toBlob(canvas,type,quality){
return new Promise(function(res){canvas.toBlob(res,type,quality)});
}
function imageCards(items){
return items.map(function(it){
var meta=formatBytes(it.size);
if(it.before){
var diff=Math.round((1-it.size/it.before)*100);
meta=formatBytes(it.before)+' → '+formatBytes(it.size)+' · '+diff+'%';
}
if(it.dims)meta=it.dims+' · '+meta;
return '<div class="card"><div class="thumb"><img src="'+it.url+'" alt=""></div><div class="card-body"><b>'+esc(it.name)+'</b><span>'+meta+'</span><a class="dl" href="'+it.url+'" download="'+esc(it.name)+'">下载</a></div></div>';
}).join('');
}
function downloadAll(items){
if(!items||!items.length)return;
items.forEach(function(it,i){
setTimeout(function(){
var a=document.createElement('a');
a.href=it.url;
a.download=it.name;
document.body.appendChild(a);
a.click();
a.remove();
},i*260);
});
toast('已开始下载 '+items.length+' 个文件');
}
function setupDrop(dropId,inputId,onFiles){
var drop=document.getElementById(dropId);
var input=document.getElementById(inputId);
if(!drop||!input)return;
input.addEventListener('change',function(){
var files=Array.prototype.slice.call(input.files||[]).filter(function(f){return f.type.indexOf('image/')===0});
input.value='';
if(files.length)onFiles(files);
});
['dragenter','dragover'].forEach(function(ev){
drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('over')});
});
['dragleave','drop'].forEach(function(ev){
drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('over')});
});
drop.addEventListener('drop',function(e){
e.preventDefault();
var files=Array.prototype.slice.call(e.dataTransfer.files||[]).filter(function(f){return f.type.indexOf('image/')===0});
if(files.length)onFiles(files);
});
}
function copyText(text){
var done=function(){toast('已复制到剪贴板')};
if(navigator.clipboard&&navigator.clipboard.writeText){
navigator.clipboard.writeText(text).then(done).catch(function(){fallbackCopy(text);done()});
}else{
fallbackCopy(text);
done();
}
}
function fallbackCopy(text){
var ta=document.createElement('textarea');
ta.value=text;
ta.style.position='fixed';
ta.style.opacity='0';
document.body.appendChild(ta);
ta.select();
try{document.execCommand('copy')}catch(err){}
ta.remove();
}
document.addEventListener('click',function(e){
var el=e.target.closest('[data-copy]');
if(!el)return;
var target=$(el.getAttribute('data-copy'));
if(!target)return;
var val=('value' in target)?target.value:target.textContent;
copyText(val);
});
window.WF={$,$$,toast,esc,formatBytes,extFor,baseName,loadImg,toBlob,imageCards,downloadAll,setupDrop,copyText};
})();
