/** Declarative directory. Future tools intentionally have no navigable route. */
export const calculatorCatalog = Object.freeze([
 {id:'pension-spain-ukraine',status:'available',route:'pensiones',template:'index.html',contentModule:'./pension-content.mjs',icon:'pension',category:'retirement',jurisdiction:['ES','UA']},
 {id:'donations-catalonia',status:'planned',route:null,icon:'gift',category:'tax',jurisdiction:['ES-CT']},
 {id:'itp-catalonia',status:'planned',route:null,icon:'document',category:'tax',jurisdiction:['ES-CT']},
 {id:'inheritance',status:'planned',route:null,icon:'family',category:'tax',jurisdiction:['ES']},
 {id:'net-salary',status:'planned',route:null,icon:'wallet',category:'income',jurisdiction:['ES']},
 {id:'mortgages',status:'planned',route:null,icon:'house',category:'housing',jurisdiction:['ES']},
 {id:'retirement-spain',status:'planned',route:null,icon:'pension',category:'retirement',jurisdiction:['ES']}
].map(tool=>Object.freeze({...tool,jurisdiction:Object.freeze(tool.jurisdiction)})));

export const catalogTranslations = {
 es:{
  'pension-spain-ukraine':['Pensión España–Ucrania','Estima tu jubilación entre España y Ucrania, paso a paso.'],
  'donations-catalonia':['Donaciones Cataluña','Una futura herramienta para entender el impuesto sobre donaciones en Cataluña.'],
  'itp-catalonia':['ITP Cataluña','Una futura herramienta para explorar el impuesto sobre transmisiones patrimoniales en Cataluña.'],
  inheritance:['Sucesiones','Una futura herramienta para entender los impuestos de una herencia.'],
  'net-salary':['Salario neto','Una futura herramienta para estimar cuánto recibirías después de las deducciones.'],
  mortgages:['Hipotecas','Una futura herramienta para explorar la cuota mensual y el coste de tu hipoteca.'],
  'retirement-spain':['Jubilación España','Una futura herramienta para explorar tu jubilación con cotizaciones en España.']
 },
 ru:{
  'pension-spain-ukraine':['Пенсия Испания–Украина','Оцените свою пенсию в Испании и Украине, шаг за шагом.'],
  'donations-catalonia':['Дарение в Каталонии','Будущий инструмент для понимания налога на дарение в Каталонии.'],
  'itp-catalonia':['ITP в Каталонии','Будущий инструмент для оценки налога на передачу имущества в Каталонии.'],
  inheritance:['Наследство','Будущий инструмент для понимания налогообложения наследства.'],
  'net-salary':['Зарплата на руки','Будущий инструмент для оценки зарплаты после удержаний.'],
  mortgages:['Ипотека','Будущий инструмент для оценки ежемесячного платежа и стоимости ипотеки.'],
  'retirement-spain':['Пенсия в Испании','Будущий инструмент для оценки пенсии при наличии стажа в Испании.']
 },
 uk:{
  'pension-spain-ukraine':['Пенсія Іспанія–Україна','Оцініть свою пенсію в Іспанії та Україні, крок за кроком.'],
  'donations-catalonia':['Дарування в Каталонії','Майбутній інструмент для розуміння податку на дарування в Каталонії.'],
  'itp-catalonia':['ITP у Каталонії','Майбутній інструмент для оцінки податку на передачу майна в Каталонії.'],
  inheritance:['Спадщина','Майбутній інструмент для розуміння оподаткування спадщини.'],
  'net-salary':['Чиста зарплата','Майбутній інструмент для оцінки зарплати після відрахувань.'],
  mortgages:['Іпотека','Майбутній інструмент для оцінки щомісячного платежу та вартості іпотеки.'],
  'retirement-spain':['Пенсія в Іспанії','Майбутній інструмент для оцінки пенсії за наявності стажу в Іспанії.']
 },
 en:{
  'pension-spain-ukraine':['Spain–Ukraine pension','Estimate your retirement income from Spain and Ukraine, step by step.'],
  'donations-catalonia':['Gifts in Catalonia','A future tool to help you understand gift tax in Catalonia.'],
  'itp-catalonia':['ITP in Catalonia','A future tool to explore property transfer tax in Catalonia.'],
  inheritance:['Inheritance','A future tool to help you understand inheritance taxes.'],
  'net-salary':['Take-home pay','A future tool to estimate what you could receive after deductions.'],
  mortgages:['Mortgages','A future tool to explore monthly repayments and the cost of your mortgage.'],
  'retirement-spain':['Retirement in Spain','A future tool to explore retirement with contributions in Spain.']
 }
};

export function localizedCatalog(lang) {
 const labels=catalogTranslations[lang];
 if(!labels)throw new RangeError(`Unsupported catalog language: ${lang}`);
 return calculatorCatalog.map(tool=>({...tool,name:labels[tool.id][0],description:labels[tool.id][1]}));
}
