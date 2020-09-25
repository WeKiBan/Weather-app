!function(t){var e={};function n(o){if(e[o])return e[o].exports;var a=e[o]={i:o,l:!1,exports:{}};return t[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(o,a,function(e){return t[e]}.bind(null,a));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e){let n=g(".menu-toggle"),o=g(".main-section"),a=g("body"),r=g(".locations"),i=(g(".new-location-form"),g(".new-location-input")),c=g(".new-location-btn"),l=g(".locations"),d=(g(".current-weather-container"),Array.from(document.querySelectorAll(".daily-weather-container")));let s,u=JSON.parse(localStorage.getItem("weather.locations"))||[],f="current",p=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];function g(t){return document.querySelector(t)}function m(){h(),y(),v("current"===f?s:u.find(t=>t.id===f))}function h(){localStorage.setItem("weather.locations",JSON.stringify(u))}function y(){!function(t){for(;t.childNodes.length>1;)t.removeChild(t.lastChild)}(r);const t=document.createElement("li");t.classList.add("location-item"),t.innerText="Current Location",t.dataset.locationId="current",t.id="current",r.appendChild(t),u.forEach(t=>{const e=document.createElement("li"),n=document.createElement("i");n.classList.add("fas"),n.classList.add("fa-trash-alt"),e.appendChild(n),n.addEventListener("click",t=>{u=u.filter(e=>e.id!==t.target.parentElement.dataset.locationId),f="current",m()}),e.classList.add("location-item"),e.innerText=t.location,e.dataset.locationId=t.id,t.id===f&&e.classList.add("active-location"),e.appendChild(n),r.appendChild(e)})}function v(t){let e=g(".current-icon"),n=g(".current-description"),a=g("[data-current-location]"),r=g("[data-current-temp]"),i=g(".date");var c,l;a.innerText=t.location.split(",")[0],(c=t.lat,l=t.lon,fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${c}&lon=${l}&exclude={part}&appid=2e44188ae7e877bf4fe23dac83d52bae`).then(t=>t.json()).then(t=>t).catch(t=>console.log(t))).then(t=>{let a=(new Date).toLocaleDateString("en-US",{timeZone:""+t.timezone,weekday:"long",month:"short",day:"numeric"});r.innerText=Math.round(t.current.temp-273.15),e.src=`./images/icons/${t.current.weather[0].icon}.png`,n.innerText=t.current.weather[0].description,i.innerText=a,t.current.dt>t.current.sunrise&&t.current.dt<t.current.sunset?(o.style.backgroundImage="url('images/day-background.png')",o.style.color="rgb(63, 63, 63)"):(o.style.backgroundImage="url('images/night-background.png')",o.style.color="#fff");let c=function(t){let e=p,n=e.findIndex(e=>e===t);return e.slice(n+1).concat(e.slice(0,n))}(a.split(",")[0]);for(var l=0;l<d.length;l++){let e=d[l],n=t.daily[l+1];const o=e.querySelector(".icon"),a=e.querySelector(".day-temp"),r=e.querySelector(".day-title");a.innerText=Math.round(n.temp.day-273.15),o.src=`./images/icons/${n.weather[0].icon}.png`,r.innerText=c[l]}})}function b(){navigator.geolocation?navigator.geolocation.getCurrentPosition((function(t){fetch(`https://eu1.locationiq.com/v1/reverse.php?key=a0e79d40c8a474&lat=${t.coords.latitude}&lon=${t.coords.longitude}&format=json`).then(t=>t.json()).then(t=>{s={id:"current",location:`${t.address.city}, ${t.address.country}`,lat:t.lat,lon:t.lon},v(s)})})):console.log("no location available")}n.addEventListener("click",(function(t){a.classList.toggle("open")})),c.addEventListener("click",t=>{t.preventDefault(),function(){const t=i.value.trim().replace(/ /g,"%20");fetch(`https://eu1.locationiq.com/v1/search.php?key=a0e79d40c8a474&q=${t}&format=json`).then(t=>t.json()).then(t=>{!function(t,e,n){var o={id:Date.now().toString(),location:t,lon:e,lat:n};u.push(o),f=o.id,m()}(t[0].display_name.split(",")[0]+","+t[0].display_name.split(",")[1],t[0].lon,t[0].lat)})}(),i.value=null}),l.addEventListener("click",t=>{"li"===t.target.tagName.toLowerCase()&&("current"===t.target.dataset.locationId?b():v(u.find(e=>e.id===t.target.dataset.locationId)),f=t.target.dataset.locationId,Array.from(l.children).forEach(t=>{t.dataset.locationId!==f?t.classList.remove("active-location"):t.classList.add("active-location")}),h())}),b(),y(),g("#current").classList.add("active-location")}]);