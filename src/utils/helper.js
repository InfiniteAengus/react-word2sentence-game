import { RAND_THRESHOLD } from 'src/config/global';

function shuffle(sourceArray, m) {
  const tempArray = sourceArray.map(t => t);
  for (var i = 0; i < RAND_THRESHOLD; i++) {
    var a = Math.floor(Math.random() * (tempArray.length));
    var b = Math.floor(Math.random() * (tempArray.length));

    var temp = tempArray[a];
    tempArray[a] = tempArray[b];
    tempArray[b] = temp;
  }
  return tempArray.slice(0, m);
}

export { shuffle }