'use client';

const HelloButton = ({name, address}) => {
  const sayHello = () => {
    alert(`Hello ${name} from ${address}!`);
  }

  return (
    <>
      <h4>Click the button</h4>
      
      <button onClick={sayHello}>Hello</button>
    </>
  )
}

export default HelloButton