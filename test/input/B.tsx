import React from 'react'
// import {Button} from 'wanke-gui'


console.log(23)

class B extends React.Component<any, any> {
  render() {
    return (
      <div className="b">
        <button onClick={() => null}>按钮1</button>
        <button onClick={() => null}>按钮2</button>
        <button onClick={() => null}>按钮3</button>
        {/*<Button type="primary">antd but</Button>*/}
      </div>
    )
  }
}

export default B
