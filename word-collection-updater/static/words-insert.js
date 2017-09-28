const API_KEY = 'NDA1OWE0MWo1b3AzYm41LnJhcGlkLmlv';



function initialize(){ 
    var jsonData = null;
    const rapidClient = Rapid.createClient(API_KEY);
    
    
    $.getJSON("data.json", function(data){
        var wordsByLevel = [[], [], [], [], [], []];
        jsonData = data;
        for (index in data.words){
            var item = data.words[index];
            var level = item.length - 3;
            try{
                if(level === 12)
                    wordsByLevel[5].push(item)
                else
                    wordsByLevel[level-1].push(item)
            }catch(e){
                console.log(e.message);
                debugger;
            }
        }

        debugger;
        var levelNumber = 1;
        for (levelNum in wordsByLevel){
            var level = wordsByLevel[levelNum]
            debugger;
            rapidClient
                .collection('List3')
                .document('level' + levelNumber)
                .mutate({
                    words: level
            });
            levelNumber++;
        }  
    });
    console.log("end of initialize()");
}

$(function() {
    initialize();
});