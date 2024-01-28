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
            <table>
              {keys.map((key) => {
                return (
                  <>
                    <tr>Phase {parseInt(key) + 1}</tr>
                    {epreuvePhaseTree[key].map((element) => {
                      return (
                        <>
                          <td>
                            Epreuve {element.epreuve} : Equipe{" "}
                            {element.firstTeam} VS Equipe {element.secondTeam}
                          </td>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </table>
          }
        </>
      );
    }
  };

  return (
    <div>
      <div>
        <h1>Générateur de brackets</h1>
        <p>Nombre d'équipes :</p>
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
      <p>Arbre de tournoi :</p>
      {computeTable()}
    </div>
  );
}
