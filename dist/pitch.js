/* YIN difference function and cumulative mean normalization for monophonic voice. */
(function(root){
function detectPitch(input,sampleRate){
 let mean=0;for(let i=0;i<input.length;i++)mean+=input[i];mean/=input.length;
 let energy=0;for(let i=0;i<input.length;i++)energy+=(input[i]-mean)**2;
 const rms=Math.sqrt(energy/input.length);if(rms<.008)return {frequency:null,rms};
 const size=Math.min(1024,Math.floor(input.length/2));const maxTau=Math.min(size-1,Math.floor(sampleRate/75));const minTau=Math.max(2,Math.floor(sampleRate/1000));
 const diff=new Float32Array(maxTau+1);for(let tau=1;tau<=maxTau;tau++){let sum=0;for(let j=0;j<size;j++){const d=input[j]-input[j+tau];sum+=d*d;}diff[tau]=sum;}
 let running=0;diff[0]=1;for(let tau=1;tau<=maxTau;tau++){running+=diff[tau];diff[tau]=running?diff[tau]*tau/running:1;}
 let tau=-1;for(let i=minTau;i<maxTau;i++){if(diff[i]<.13){while(i+1<maxTau&&diff[i+1]<diff[i])i++;tau=i;break;}}
 if(tau<0)return {frequency:null,rms};const a=diff[tau-1],b=diff[tau],c=diff[tau+1];const den=2*(2*b-c-a);const refined=tau+(den?(c-a)/den:0);return {frequency:sampleRate/refined,rms};
}
root.detectPitch=detectPitch;if(typeof module!=='undefined')module.exports={detectPitch};
})(typeof window!=='undefined'?window:globalThis);
