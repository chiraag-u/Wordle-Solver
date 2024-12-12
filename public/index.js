const Grid = document.querySelectorAll("#Container div")
var ActiveRow = 1

UpdatedList = []
function MostUncommon() {
    let CommonCounter = str => {
        return str.split('').reduce((total, letter) => {
            total[letter] ? total[letter]++ : total[letter] = 1;
            return total;
        }, {});
    };
    let PossibleWords = Object.keys(UpdatedList)
    let RepeatedLetters = PossibleWords.map(Each => Object.values(CommonCounter(Each)).filter(item => item !== 1).reduce((partialSum, a) => partialSum + a, 0))
    return PossibleWords[RepeatedLetters.indexOf(Math.min(...RepeatedLetters))]
}


for (const words of Data.split(",")) {
    UpdatedList[words] = words.split("")
}
function Eliminate(Yellow, Green, Gray) {
    // Eliminate words which do not have yellow letters
    for (let i = 0; i < Yellow.length; i++) {
        let YellowLetter = Yellow[i][1];
        for (const Words in UpdatedList) {
            if (!Words.includes(YellowLetter)) {
                delete UpdatedList[Words]
            } else {
                if (Words[Yellow[i][0]-1] == YellowLetter) {
                    console.log("warn")
                    delete UpdatedList[Words]
                }
            }
        }
    }

    // Eliminate words which have gray letters
    for (let i = 0; i < Gray.length; i++) {
        let GrayLetter = Gray[i];
        for (const Words in UpdatedList) {
            if (Words.includes(GrayLetter)) {
                delete UpdatedList[Words]
            }
        }
    }

    // Eliminate words which do not have the same letter at green position
    for (let i = 0; i < Green.length; i++) {
        let GreenDetails = Green[i];
        for (const Words in UpdatedList) {
            if (Words[GreenDetails[0] - 1] != GreenDetails[1]) {
                delete UpdatedList[Words]
            }
        }
    }

}


for (let i = 0; i < Grid.length; i++) {
    Grid[i].addEventListener("click", function () {
        if (this.getAttribute("Click") == "true") {
            if (this.getAttribute("Double") == "true") {
                if (this.getAttribute("Color") == "Yellow") {
                    this.setAttribute("Color", "Green")
                } else {
                    this.setAttribute("Color", "Yellow")
                }
            } else {
                if (this.getAttribute("Color") == "Gray") {
                    this.setAttribute("Color", "Yellow")
                } else if (this.getAttribute("Color") == "Yellow") {
                    this.setAttribute("Color", "Green")
                } else if (this.getAttribute("Color") == "Green") {
                    this.setAttribute("Color", "Gray")
                } else {
                    this.setAttribute("Color", "Gray")
                }
            }
        }
    })
}
var LogWordsGreen = []
var LogWordsYellow = []
document.getElementById("Suggest").addEventListener("click", function () {
    if (ActiveRow < 6) {
        ActiveRow++
        var Ops = Array.from(document.querySelectorAll("[Click='true']")).map(Each => [Each.id, Each.getAttribute("Color"), Each])
        let Gray = []
        let Yellow = []
        let Green = []
        for (let i = 0; i < Ops.length; i++) {
            if (Ops[i][1] == "Gray") {
                Gray.push(Ops[i][2].textContent.trim())
            } else if (Ops[i][1] == "Yellow") {
                Yellow.push([Ops[i][0] - (ActiveRow - 2) * 5, Ops[i][2].textContent.trim()])
                LogWordsYellow.push(Ops[i][2].textContent.trim())
            } else if (Ops[i][1] == "Green") {
                Green.push([Ops[i][0] - (ActiveRow - 2) * 5, Ops[i][2].textContent.trim()])
                LogWordsGreen.push(Ops[i][2].textContent.trim())
            }
            Ops[i][2].setAttribute("Click", "false")
        }
        Eliminate(Yellow, Green, Gray)
        let Suggestion = MostUncommon()
        if (Suggestion) {
            Suggestion = Suggestion.split("")
            let Run = 0
            for (let i = (ActiveRow - 1) * 5 + 1; i < (ActiveRow * 5) + 1; i++) {
                document.getElementById(i).querySelector("p").textContent = Suggestion[Run]
                document.getElementById(i).setAttribute("Click", "true")
                if (LogWordsGreen.includes(Suggestion[Run])) {
                    document.getElementById(i).setAttribute("Color", "Green")
                    document.getElementById(i).setAttribute("Click", "false")
                }
                else if (LogWordsYellow.includes(Suggestion[Run])) {
                    document.getElementById(i).setAttribute("Color", "Yellow")
                    document.getElementById(i).setAttribute("Double", "true")
                }
                else {
                    document.getElementById(i).setAttribute("Color", "Gray")
                }
                Run++
            }
        } else {
            var typewriter = new Typewriter(document.getElementsByTagName("h1")[0], {
                loop: false
            });
            typewriter.typeString('NO WORDS FOUND').start();
        }
    } else {
        var typewriter = new Typewriter(document.getElementsByTagName("h1")[0], {
            loop: false
        });

        typewriter.typeString("SORRY :( COULDN'T FIND").start();
    }
})