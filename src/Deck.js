import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import './Deck.css';

const Deck = () => {
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const res = useRef();

  const getDeck = async () => {
    // Generates a new deck
    res.current = await axios.get(
      `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
    );
    setDeck(res.current.data);
    console.log(res.current.data);
  };

  useEffect(() => {
    getDeck();

    return () => {
      console.log("restart");
    };
  }, []);

  const drawCard = async () => {
    try {
      // Check if any cards remaining in deck
      if (deck.remaining === 0) {
        alert("Error: no cards remaining!");
        return;
      }
      // Draw card from deck
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
      );

      generateCoordinate(response.data.cards[0]);
      // add new card to state
      setCards((prevCards) => [...prevCards, response.data.cards[0]]);
      console.log(cards);

      // subtract drawn card from deck state
      setDeck((prevDeck) => ({
        ...prevDeck,
        remaining: prevDeck.remaining - 1,
      }));
      console.log(deck);
    } catch (err) {
      console.log("Error drawing card", err);
    }
  };

  function generateCoordinate(card) {
    // Set x, y, and rotate values
    let [x, y, r] = [
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 30),
      Math.floor(Math.random() * 61) - 30,
    ];

    card["x"] = x;
    card["y"] = y;
    card["r"] = r;
  }

  const handleRestart = async () => {
    try {
      setDeck(null);
      setCards([]);
      await getDeck();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button onClick={drawCard}>Draw Card</button>
      <button onClick={handleRestart}>Restart</button>
      {deck && <h1>{deck.deck_id ? deck.deck_id : "Loading..."}</h1>}

      <div className="pile">
        {cards.map((card) => (
          <Card
            key={card.code}
            img={card.image}
            coord={[card.x, card.y, card.r]}
          />
        ))}
      </div>
    </div>
  );
};

export default Deck;
