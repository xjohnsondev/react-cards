const Card = ({ img, coord }) => {
    const styles = {
        position: 'absolute',
        transform: `translate(${coord[0]}px, ${coord[1]}px) rotate(${coord[2]}deg)`
    }
  return (<img 
    src={img}
    style={styles}
    alt="card"
    >
    </img>)
};

export default Card;
