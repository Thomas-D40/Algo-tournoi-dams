import React, { useEffect, useState } from "react";

export default function Main() {
  const [nbrEquipe, setNbrEquipe] = useState(4);
  const [nbrEpreuve, setNbrEpreuve] = useState(2);
  const [initialRepartition, setInitialRepartition] = useState();
  const [teamPhaseTree, setTeamPhaseTree] = useState();
  const [epreuvePhaseTree, setEpreuvePhaseTree] = useState();

  useEffect(() => {
    if (nbrEquipe > 0) {
      let repartition = [];
      let numeroEpreuve = 0;
      for (let i = 1; i <= nbrEquipe; i++) {
        if (i % 2 === 1) {
          numeroEpreuve++;
        }
        let association = {};
        association.key = i;
        association.value = numeroEpreuve;
        repartition.push(association);
      }
      setInitialRepartition(repartition);
    }
  }, [nbrEquipe]);

  useEffect(() => {
    if (initialRepartition != null) {
      let actualPhase = initialRepartition;
      let phaseTree = { "Phase 1": actualPhase };
      for (let i = 1; i < nbrEpreuve; i++) {
        let newPhase = [];
        Object.values(actualPhase).forEach((element) => {
          let newElement = {};
          newElement.key = element.key;
          newElement.value = element.value;

          computeElementForNextPhase(newElement);

          newPhase.push(newElement);
        });

        actualPhase = newPhase;
        phaseTree["Phase " + (i + 1)] = newPhase;
      }

      setTeamPhaseTree(phaseTree);
    }
  }, [initialRepartition, nbrEpreuve]);

  useEffect(() => {
    if (teamPhaseTree) {
      let epreuvePhaseTree = [];
      let keys = Object.keys(teamPhaseTree);
      keys.forEach((key) => {
        let phaseArray = teamPhaseTree[key];
        let phaseFromEpreuve = [];
        for (let i = 1; i <= teamPhaseTree[key].length / 2; i++) {
          let epreuveObject = {
            epreuve: i,
            firstTeam: "",
            secondTeam: "",
          };
          for (let j = 0; j < teamPhaseTree[key].length; j++) {
            if (phaseArray[j].value === i) {
              if (epreuveObject.firstTeam === "") {
                epreuveObject.firstTeam = phaseArray[j].key;
              } else {
                epreuveObject.secondTeam = phaseArray[j].key;
              }
            }
          }
          phaseFromEpreuve.push(epreuveObject);
        }
        epreuvePhaseTree.push(phaseFromEpreuve);
      });
      setEpreuvePhaseTree(epreuvePhaseTree);
    }
  }, [teamPhaseTree]);

  const computeElementForNextPhase = (element) => {
    if (element.key % 2 === 1) {
      if (element.value === nbrEpreuve) {
        element.value = 1;
      } else {
        element.value++;
      }
    } else {
      if (element.value === 1) {
        element.value = nbrEpreuve;
      } else {
        element.value--;
      }
    }

    return element;
  };

  const computeTable = () => {
    if (epreuvePhaseTree) {
      let keys = Object.keys(epreuvePhaseTree);
      return (
        <>
          {
            <>
              {keys.map((key) => {
                return (
                  <div className="phase-container">
                    <h3 className="phase-announcer">
                      Phase {parseInt(key) + 1}
                    </h3>
                    {epreuvePhaseTree[key].map((element) => {
                      return (
                        <>
                          <p className="match-container">
                            <b>Epreuve {element.epreuve}</b> : Equipe{" "}
                            {element.firstTeam} VS Equipe {element.secondTeam}
                          </p>
                        </>
                      );
                    })}
                  </div>
                );
              })}
            </>
          }
        </>
      );
    }
  };

  const generateCSVFile = () => {
    if (epreuvePhaseTree) {
      let keys = Object.keys(epreuvePhaseTree);
      let csvContent = "data:text/csv;charset=utf-8, \n";
      csvContent += "Epreuve;Equipe1;Equipe2; \n";
      keys.map((key) => {
        csvContent += "Phase " + (parseInt(key) + 1) + "\n";
        epreuvePhaseTree[key].map((element) => {
          csvContent +=
            "Epreuve " +
            element.epreuve +
            ";" +
            "Equipe " +
            element.firstTeam +
            ";" +
            "Equipe " +
            element.secondTeam +
            ";\n";
        });
      });

      let encodedUri = encodeURI(csvContent);
      // Create a link to download it
      var pom = document.createElement("a");
      pom.href = encodedUri;
      pom.setAttribute("download", "RecapTournoi.csv");
      pom.click();
    }
  };

  return (
    <div>
      <div>
        <h1>Générateur de brackets</h1>
        <h2>Nombre d'équipes :</h2>
        <input
          onChange={(e) => {
            setNbrEquipe(e.target.value);
            setNbrEpreuve(e.target.value / 2);
          }}
          type="number"
          defaultValue={nbrEquipe}
          step={2}
        ></input>
      </div>
      {/* <div>
        <p>Nombre d'épreuves :</p>
        <input
          onChange={(e) => setNbrEpreuve(e.target.value)}
          type="number"
          defaultValue={nbrEpreuve}
        ></input>
      </div> */}
      <h2>Arbre de tournoi :</h2>
      <button onClick={() => generateCSVFile()}>Télécharger en CSV</button>
      {computeTable()}
    </div>
  );
}
