import { isArticleName, isArticleNumber, isQuantity } from "../utils/regExChecker.js";
import { findArticleByNumber } from "../services/searchService.js";
import { promoteToFreeStanding, replaceHeaderInPortfolio } from "../utils/headerConversion.js";
import Article from "../../models/article.js";
import { testCreatedArticle } from '../tests/articleSequenceTest.js'
let nameBackUp = undefined
let descriptionBackUp = undefined 
let artNrBackUp = undefined 

let nextDescription = false;
let nextQuantity = false;
let nextPrice = false;
let currentArticle = undefined;
let headerPendingChange = false;

export function switchLines(currentHeader, line, currentSectionPortfolio){
	if(nextPrice){
		const exp = "Denna produkt har utgått och kan inte läggas till i varukorgen eller inköpslistan"
		const match = line.match(/:\s*([\d\s]+(?:[.,]\d+)?)\s*SEK/i);
		if (match || line === exp) {
			
			if(match){
			let priceLine = line.replace("Nuvarande pris:", "").replace("SEK", "").trim().replace(" ","")
			currentArticle.totPrice = Number(priceLine.replace(",", "."))
			}
			else if (exp){
				currentArticle.quantity = parseFloat(1);
				currentArticle.totPrice = parseFloat(0);
				currentHeader.expAlert.push(currentArticle);
				currentSectionPortfolio.expAlert.push(currentArticle);
			}
			currentHeader.addArticle(currentArticle);
	  	testCreatedArticle(currentArticle.artNr, currentHeader);
			resetArticleState();

			if(headerPendingChange)
			{
		    const newHeader = promoteToFreeStanding(currentHeader);
        replaceHeaderInPortfolio(currentSectionPortfolio, currentHeader, newHeader);
        currentHeader = newHeader;
				headerPendingChange = false;
				return currentHeader; 
			}
		}
	}
  if(nextQuantity){ /* Quantity kommer alltid direkt efter arikelnummer*/
    if(isQuantity(line)){
			let quantityStr = line.replace('x', '').replace(',', '.').trim();
      currentArticle.quantity = parseFloat(quantityStr);
		}
		else { console.log("NÄSTA ÄR KVANTITET MEN NÅGOT HAR GÅTT FEL!!!!!!")}
		nextQuantity = false;
		nextPrice = true;
  }

	if(nextDescription){ /* Description kommer alltid direkt efter arikelnamn*/
    descriptionBackUp = line
    nextDescription = false;		
  }

	let lineLastWord = undefined;
  if(currentHeader.constructor.name === "SecondStageHeader"){ /* Om Namn står sist */
    lineLastWord = getLastValue(line);
  }

	if(line === "Detta skåp innehåller en eller flera täcksidor. Du hittar den/dem nedan."){
		currentHeader.attachedPOF = true;
	}

  if(isArticleName(line) || isArticleName(lineLastWord)){
    if(line === "IKEA") return;
    isArticleName(lineLastWord) ? nameBackUp = lineLastWord : nameBackUp = line;
    nextDescription = true;
    return;
  }

	if (isArticleNumber(line)) {
    artNrBackUp = line;
    // Hitta artikel i databasen
    const found = findArticleByNumber(artNrBackUp);
    if (found) {
			// Om artikel finns, skapa artikelobjekt och matcha data
			currentArticle = new Article(line)
			currentArticle.name = found.name;
			currentArticle.description = found.description;
			currentArticle.width = found.width;
			currentArticle.depth = found.depth;
			currentArticle.height = found.height;
			currentArticle.color = found.color;
			currentArticle.group1 = found.group1;
			currentArticle.group2 = found.group2;
			currentArticle.group3 = found.group3;
			currentArticle.group4 = found.group4;
			currentArticle.heightAffecting = found.heightAffecting;
			if (found.group1 === "Vitvara" && found.group3 === "Fristående") {
				headerPendingChange = true;
      }
		}
		else {
      // Om artikel inte finns, skapa ny artikel från sparade värden
			currentArticle = new Article(line)
			currentArticle.name = nameBackUp;
			currentArticle.description = descriptionBackUp;
			currentHeader.missingAlert.push(`❌ Följande artikel saknas i databasen: ${nameBackUp} ${descriptionBackUp} ${artNrBackUp}`);
    } 
		nextQuantity = true;
  }
}

function getLastValue(line) {
  // Dela på mellanslag
  const parts = line.split(" ");
  let lastPart = parts[parts.length - 1];

  // Om sista delen innehåller komma, dela igen
  if (lastPart.includes(",")) {
    const commaParts = lastPart.split(",");
    lastPart = commaParts[commaParts.length - 1];
  }
  return lastPart;
}

function resetArticleState() {
  nextDescription = false;
  nextQuantity = false;
  nextPrice = false;
  currentArticle = undefined;
  nameBackUp = undefined;
  descriptionBackUp = undefined;
  artNrBackUp = undefined;
}