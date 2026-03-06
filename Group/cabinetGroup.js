export function makeGroups(sectionPortfolio){
const result = [];
let currentGroup = null;

sectionPortfolio.returnHeaders().forEach(header => {
  const isSecondStage = header.constructor.name !== 'SecondStageHeader';
  const isCoverPanel = header.constructor.name === 'CoverPanelHeader';

  // Skippa headers som inte är relevanta
  if (!isSecondStage && !isCoverPanel) {
    return;
  }

  // Trigger: attachedPOF === true ELLER CoverPanelHeader
  const isTrigger = header.attachedPOF === true || isCoverPanel;

  if (isTrigger) {
    if (currentGroup) {
      // Avsluta grupp
      currentGroup.push(header);
      result.push(currentGroup);
      currentGroup = null;
    } else {
      // Starta ny grupp
      currentGroup = [header];
    }
  } else {
    // attachedPOF === false
    if (currentGroup) {
      currentGroup.push(header);
    }
  }
});

  // Logga resultatet
  console.log(
  result.map(group => group.map(header => header.number))
);


}