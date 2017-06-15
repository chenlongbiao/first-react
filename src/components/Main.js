require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//引入图片资源
var  imageDatas=require('../data/imageDatas.json');

// let yeomanImage = require('../images/yeoman.png');
//将图片资源json对象中的图片路径拿到并写入图片资源信息对象中
function getImageDataUrl(imageDatasArr) {
  for (let i=0;i<imageDatasArr.length;i++){
     let imageData = imageDatasArr[i];
     imageData.imageURL = require('../images/'+imageData.fileName);
      imageDatasArr[i]=imageData
  }
  return imageDatasArr
}

imageDatas=getImageDataUrl(imageDatas);
class firstReact extends React.Component {
  render() {
    return (
      //舞台
      <section className="stage">
        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

firstReact.defaultProps = {
};

export default firstReact;
