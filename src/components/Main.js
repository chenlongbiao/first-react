require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from "react-dom"

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
/**/
function getRangeRandom(low,high) {
  return Math.ceil(Math.random()*(high-low)+low)

}

//单个图片组件
class ImgFigure extends React.Component{
  render(){
    var styleObj ={};
    if (this.props.arrange.pos)

    return(
      <figure className="img-figure">
        <img src={this.props.data.imageURL}
              alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
        </figcaption>
      </figure>
    );
  }
};


class firstReact extends React.Component {


  constructor(props){
    Constant:{
      centerPos:{
        left:0,
          right:0
      },
      hPosRange:{ //水平方向取值范围
        leftSecX: [0,0],
          rightSecX:[0,0],
          y:[0,0]
      }
      vPosRange:{ //垂直方向取值范围
        x:[0,0],
          topY:[0,0]
      }
    },

    super(props);

    this.state = { // define this.state in constructor

      imgsArrangeArr:[
        {
          // pos:{
          //   left:0,
          //   top:0
          // }
        }
      ]

    }

  }
  /**
   * 重新排布图片
   * @param centerIndex
   */
  rearrange(centerIndex){
     var imgsArrangArr=this.stage.imgsArrangeArr,
         Constant=this.Constant,
       centerPos=Constant.centerPos,
       hPosRange=Constant.hPosRange,
       vPosRange=Constant.vPosRange,
       hPosRangeLeftSecX=hPosRange.leftSecX,
       hPosRangeRightSecX=hPosRange.rightSecX,
       hPosRangeY=hPosRange.y,
       vPosRangeTopY=vPosRange.topY,
       vPosRangeX=vPosRange.x,

       imgsArrangeTopArr = [],

       topImgNum=Math.ceil(Math.random()*2),
       topImgSpliceIndex=0,
       imgsArrangeCenterArr=imgsArrangArr.splice(centerIndex,1),


       //首先居中centerIndex的图片
       imgsArrangeCenterArr[0].pos=centerPos;

       //取出要布局上侧的图片的状态信息
       topImgSpliceIndex= Math.ceil(Math.random()*(imgsArrangArr.length - topImgNum));
       imgsArrangeTopArr = imgsArrangArr.splice(topImgSpliceIndex,topImgNum);
       //布局位于上侧的图片
       imgsArrangArr.forEach((value,index)=>{
         imgsArrangeTopArr[index].pos={
           top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
            left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
         }
       })
        //布局左右两侧的图片
        for (var i=0,j=imgsArrangArr.length, k=j/2; i<j; i++){
           var hPosRangeLORX =null;
           //前半部分布局左边。后半部分布局右边
           if (i<k){
             hPosRangeLORX=hPosRangeLeftSecX;

           }else {
             hPosRangeLORX=hPosRangeRightSecX;
           }
           imgsArrangArr[i].pos={
             top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
             left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
           }
        }
        if (imgsArrangeTopArr &&imgsArrangeTopArr[0]){
          imgsArrangArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangArr:imgsArrangArr
        })
  }
  //组件加载以后为每张图片计算位置范围
  componentDidMount() {
    //拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2)
    //拿到单个图片组件的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2)

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
    //计算左侧和右侧区域的位置点
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW-halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW -halfImgW;
    this.Constant.hPosRange.y[0]=-halfImgH;
    this.Constant.hPosRange.y[1]=stageH-halfImgH;
    // 计算上侧区域图片位置点
    this.Constant.vPosRange.topY[0]= - halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH - halfImgH*3;
    this.Constant.vPosRange.x[0]=halfImgW-imgW;
    this.Constant.vPosRange.x[1]=halfImgW;

    this.rearrange(0);
  }
  render() {
    var controllerUnits =[],
        imgFigures=[];
    imageDatas.forEach((value, index) =>{
      if(!this.state.imgsArrangeArr[index]){
         this.state.imgsArrangeArr[index]={
           pos:{
             left:0,
             top:0
           }
         }
      }
      imgFigures.push(<ImgFigure data = {value} ref={'imgFigures'+index} arrange={this.state.imgsArrangeArr[index]}/>);
    }.bind(this));
    return (
      /*舞台*/
      <section className="stage" ref="stage">
        {/*图片*/}
        <section className="img-sec">
          {imgFigures}
        </section>
        {/*控制条*/}
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

firstReact.defaultProps = {
};

export default firstReact;
