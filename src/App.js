//React Core
import { useEffect, useState } from 'react';
// Styles
import './App.css';
//Images
import header from './assets/Logo.png';
import loadingImg from './assets/loading.gif';
import Img404 from './assets/404.png';
import allianceLogoImg from './assets/alliance-logo.png';
import closeImg from './assets/close.png';
//Services
import ListLocationService from './services/ListLocation';
import GetTopSecretService from './services/GetTopSecret';
import PostTopSecretService from './services/PostTopSecret';
import PostTopSecretSplitService from './services/PostTopSecretSplit';

function App() {

  const Xcoordinates = [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500];
  const Ycoordinates = [500, 400, 300, 200, 100, 0, -100, -200, -300, -400, -500];

  const [locations, setLocations] = useState();

  const [loading, setLoading] = useState(false);
  const [see404, setSee404] = useState(false);
  const [popUp, setPopUp] = useState(false);

  const [message, setMessage] = useState("");

  const [sendMessage, setSendMessage] = useState("");
  const [position, setPosition] = useState("");

  const [messages, setMessages] = useState({
    kenobi: [], skywalker: [], sato: []
  });

  const [kenobiDistance, setKenobiDistance] = useState("");
  const [skywalkerDistance, setSkywalkerDistance] = useState("");
  const [satoDistance, setSatoDistance] = useState("");

  useEffect(() => {

  }, []);

  const seeLocations = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setLocations(await ListLocationService());
    }, 2000);
    setTimeout(async () => {
      setLocations(undefined);
    }, 5000);
  }

  const handleMessage = async (event) => {
    let message = event.target.value;
    setMessage(message);
    encrypt({ kenobi: message.trim().split(" "), skywalker: message.trim().split(" "), sato: message.trim().split(" ") });
  }

  const encrypt = async (messages) => {
    let i = 0;
    while ((messages['kenobi'])[i]) {
      (messages['kenobi'])[i] = '';
      i = i + 3;
    }

    let j = 1;
    while ((messages['skywalker'])[j]) {
      (messages['skywalker'])[j] = '';
      j = j + 3;
    }

    let k = 2;
    while ((messages['sato'])[k]) {
      (messages['sato'])[k] = '';
      k = k + 3;
    }
    setMessages(messages);
  }

  const handleDistance = async (event, satellite) => {
    if (!isNaN(event.target.value)) {
      if (satellite == 'kenobi') {
        setKenobiDistance(event.target.value)
      }
      else if (satellite == 'skywalker') {
        setSkywalkerDistance(event.target.value)
      }
      else if (satellite == 'sato') {
        setSatoDistance(event.target.value)
      }
    }
  }

  const handleTopSecret = async () => {
    if (satoDistance != '' && skywalkerDistance != '' && kenobiDistance != '' && message != '') {
      let request = {
        "satellites": [
          {
            "name": "kenobi",
            "distance": Number(kenobiDistance),
            "message": messages['kenobi']
          },
          {
            "name": "skywalker",
            "distance": Number(skywalkerDistance),
            "message": messages['skywalker']
          },
          {
            "name": "sato",
            "distance": Number(satoDistance),
            "message": messages['sato']
          }
        ]
      }
      try {
        let response = await PostTopSecretService(request);
        setSendMessage(response.message);
        setPosition("[" + response.location.x + "," + response.location.y + "]");
        setTimeout(async () => {
          setPosition("");
          setSendMessage("");
        }, 5000);
      } catch (ex) {
        setSee404(true);
      }
    }
  }

  const handleTopSecretSplit = async (satellite) => {
    let request = {
      "distance": Number(satellite == 'kenobi' ? kenobiDistance : satellite == 'skywalker' ? skywalkerDistance : satoDistance),
      "message": messages[satellite]
    }
    try {
      await PostTopSecretSplitService(request, satellite);
    } catch (ex) {
      setSee404(true);
    }
  }

  const getTopSecretSplit = async () => {
    try {
      let response = await GetTopSecretService();
      setSendMessage(response.message);
      setPosition("[" + response.location.x + "," + response.location.y + "]");
      setTimeout(async () => {
        setPosition("");
        setSendMessage("");
      }, 5000);
    } catch (ex) {
      setSee404(true);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={seeLocations} className="location-btn">
          Ver Ubicacion de satellites
        </button>
        <button className="top-secret-btn" onClick={() => setPopUp(true)}>
          top secret
        </button>
        <img src={header} />
        <img src={loadingImg} className="loading" style={{ display: loading ? 'block' : 'none' }} />
        <div className="not-found" style={{ display: see404 ? 'block' : 'none' }} >
          <img src={Img404} />
          <br />
          <button onClick={() => setSee404(false)}>Close</button>
        </div>
        <div className="top-secret-form" style={{ display: popUp ? 'block' : 'none' }}>
          <button className="close-btn" onClick={() => setPopUp(false)}>
            <img src={closeImg}></img>
          </button>
          <img src={allianceLogoImg} />
          <p>
            Bienvenido, aqui podras comunicarte con las naves de la alianza, podras enviar mensajes individuales o todos en conjunto, solo coloca que tan lejos estas de cada nave y el mensaje que quieres enviar
          </p>
          <input placeholder="Mensaje" value={message} onChange={handleMessage}></input>
          <table>
            <tr>
              <td>
                Kenobi
              </td>
              <td>
                Skywalker
              </td>
              <td>
                Sato
              </td>
            </tr>
            <tr>
              <td>
                <input placeholder="Distancia" value={kenobiDistance} onChange={(e) => { handleDistance(e, 'kenobi') }}></input>
              </td>
              <td>
                <input placeholder="Distancia" value={skywalkerDistance} onChange={(e) => { handleDistance(e, 'skywalker') }}></input>
              </td>
              <td>
                <input placeholder="Distancia" value={satoDistance} onChange={(e) => { handleDistance(e, 'sato') }}></input>
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={() => handleTopSecretSplit('kenobi')}>Enviar mensaje</button>
              </td>
              <td>
                <button onClick={() => handleTopSecretSplit('skywalker')}>Enviar mensaje</button>
              </td>
              <td>
                <button onClick={() => handleTopSecretSplit('sato')}>Enviar mensaje</button>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <button onClick={handleTopSecret}>Enviar a todos</button>
                <button onClick={getTopSecretSplit}>ver mensaje enviado</button>
              </td>
            </tr>
          </table>
          {sendMessage != '' &&
            <label>
              Mensaje enviado: {sendMessage} - Tu posicion {position}
            </label>}
        </div>

        <table>
          {
            Ycoordinates.map(y => {
              return (
                <tr>
                  {
                    Xcoordinates.map(x => {
                      return (
                        locations ?
                          <td id={x + "|" + y} className={locations['sato'].x == x && locations['sato'].y == y ? 'sato'
                            : locations['kenobi'].x == x && locations['kenobi'].y == y ? 'kenobi'
                              : locations['skywalker'].x == x && locations['skywalker'].y == y ? 'skywalker' : 'other'}>
                            {
                              locations['sato'].x == x && locations['sato'].y == y ? 'Sat'
                                : locations['kenobi'].x == x && locations['kenobi'].y == y ? 'ken'
                                  : locations['skywalker'].x == x && locations['skywalker'].y == y ? 'Sky' : ''
                            }
                          </td>
                          :
                          <td id={y + "|" + x}>
                          </td>
                      );
                    })
                  }
                </tr>
              )
            })
          }
        </table>
      </header>
    </div>
  );
}

export default App;
