export function composition(result, minimum) {
 const amounts=[result?.spanish?.annual??null,minimum?.annual??null,result?.ukraine?.annual??null];
 const subtotal=amounts.reduce((sum,x)=>sum+(x??0),0);
 return {amounts,subtotal,total:amounts.every(x=>x!=null)?subtotal:null,shares:amounts.map(x=>x==null||subtotal===0?0:x/subtotal*100)};
}
