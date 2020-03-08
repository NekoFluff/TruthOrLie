export const renderMultilineText = (text) => {
  return (
  <div>
      {text.split("\n").map((i,key) => {
          return <p style={{color: 'black'}}key={key}>{i}</p>;
      })}
  </div>);
}