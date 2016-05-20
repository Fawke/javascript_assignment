var fs = require('fs');
var fileContents = fs.createReadStream('../csv/Indicators.csv');
var rl=require('readline').createInterface({
	input:fileContents,
	terminal:false
});
var newLine=[];
var gender=["M","F"];
var index=0;
var headers=[];
var male_indicator_code='SP.DYN.LE00.MA.IN';
var female_indicator_code='SP.DYN.LE00.FE.IN';
var total_indicator_code='SP.DYN.LE00.IN';
var countrys=["AFGHANISTAN","AZERBAIJAN", "JAPAN", "QATAR", "ARMENIA", "JORDAN", "SAUDI ARABIA", "BAHRAIN", "KAZAKHSTAN", "SINGAPORE", "BANGLADESH", "KUWAIT", "SOUTH KOREA", "BHUTAN", "KYRGYZSTAN", "SRI LANKA", "BRUNEI", "LAOS", "SYRIA", "BURMA" ,
"LEBANON", "TAIWAN", "CAMBODIA", "MALAYSIA", "TAJIKISTAN", "CHINA", "MALDIVES", "THAILAND", "TIMOR-LESTE", "MONGOLIA", "TURKEY", "INDIA", "NEPAL", "TURKMENISTAN", "INDONESIA", "NORTH KOREA", "UNITED ARAB EMIRATES", "IRAN", "OMAN", "UZBEKISTAN",
"MYANMAR","IRAQ", "PAKISTAN", "VIETNAM", "ISRAEL", "PHILIPPINES", "YEMEN"];
var IndicatorsMF=[];
var IndicatorsTT=[];
//Read data line by line
rl.on('line',function(line){
	var lineObj={};
	newLine=line.replace(/"[^"]+"/g, function (match) {
    return match.replace(/,/g, '|');
}).split(",");

	if(index==0){
		headers=newLine;
		index++;
	}else{
		if((newLine.indexOf(female_indicator_code)!=-1 || newLine.indexOf(male_indicator_code)!=-1 || newLine.indexOf(total_indicator_code)!=-1) && (countrys.indexOf(newLine[0].toUpperCase())!=-1) ){
			if(male_indicator_code===newLine[3]){
				newLine[3]=gender[0];
			}

			if(female_indicator_code===newLine[3]){
				newLine[3]=gender[1];
			}
		for(i=0;i<headers.length;i++){
			lineObj[headers[i]]=newLine[i].replace(/"/g,"").replace("|",",");
		}
		delete lineObj.CountryCode;
		delete lineObj.IndicatorName;


		if(newLine.indexOf(gender[0])!=-1 || newLine.indexOf(gender[1])!=-1){
				delete lineObj.CountryName;
				IndicatorsMF.push(lineObj);
	}
		if(newLine.indexOf(total_indicator_code)!=-1){
			delete lineObj.IndicatorCode;

				IndicatorsTT.push(lineObj);
	}
}
}
});
rl.on('close',function(line){
//write json for male and female life expectency chart
fs.writeFile("../json/male_female.json", JSON.stringify(IndicatorsMF, null, 4), function(err) {
			if(err) {
				console.log(err);
			}
		});
//write json for toral life expectency chart
fs.writeFile("../json/total.json", JSON.stringify(IndicatorsTT, null, 4), function(err) {
						if(err) {
							console.log(err);
						}

});
});
  
   
