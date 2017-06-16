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

};
/*获取0-30度之间的任意正负值*/
function get30DegRandom() {
return((Math.random()>0.5 ? '':'-')+Math.ceil(Math.random()*30))
}

//单个图片组件
class ImgFigure extends React.Component{
  /**
   * imgfigure的点击处理函数
   * @returns {XML}
   */
  handleClick(e){
      this.props.inverse();
      console.log(this.props)
     // e.stopPropagation();
     // e.preventDefault();
  }
  render(){
    // console.log(this.props)
    var styleObj ={};
    //如果props属性中指定了这个图片的位置。则使用
    if (this.props.arrange.pos){
        styleObj=this.props.arrange.pos;
    };
    //如果图片的旋转角度有值
    if (this.props.arrange.rotate){
      (['Moz','ms','Webkit','']).forEach((value,index)=>{
        styleObj[value+'Transform'] ='rotate('+this.props.arrange.rotate+'deg)';
      })

    }
    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse? ' is-inverse ' : '';


    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imageURL}
              alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>

          </div>
        </figcaption>
      </figure>
    );
  }
};


class firstReact extends React.Component {

  constructor(props){
    super(props);
    this.Constant={
      centerPos:{
        left:0,
          right:0
      },
      hPosRange:{ //水平方向取值范围
        leftSecX: [0,0],
          rightSecX:[0,0],
          y:[0,0]
      },
      vPosRange:{ //垂直方向取值范围
        x:[0,0],
          topY:[0,0]
      }
    },
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
  inverse (index){
    return function () {
      var imgsArrangeArr= this.state.imgsArrangeArr;
       console.log('----------')
       console.log(this.state)
       console.log('----------')

      imgsArrangeArr[index].isInverse =!imgsArrangeArr[index].isInverse;
      this.state={
        imgsArrangeArr:imgsArrangeArr
      }
    }.bind(this)
  }
  /**
   * 重新排布图片
   * @param centerIndex
   */
  rearrange(centerIndex){
     var imgsArrangeArr=this.state.imgsArrangeArr,
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
       imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);


       //首先居中centerIndex的图片
       imgsArrangeCenterArr[0].pos=centerPos;

       //居中图片不需要旋转
       imgsArrangeCenterArr[0].rotate=0;


       //取出要布局上侧的图片的状态信息
       topImgSpliceIndex= Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum));
       imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
       //布局位于上侧的图片
       imgsArrangeTopArr.forEach((value,index)=>{
         imgsArrangeTopArr[index]={
           pos:{
             top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
             left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
           },
           rotate:get30DegRandom()
         }
       })
        //布局左右两侧的图片
        for (var i=0,j=imgsArrangeArr.length, k=j/2; i<j; i++){
           var hPosRangeLORX =null;
           //前半部分布局左边。后半部分布局右边
           if (i<k){
             hPosRangeLORX=hPosRangeLeftSecX;

           }else {
             hPosRangeLORX=hPosRangeRightSecX;
           }
           imgsArrangeArr[i]={
             pos:{
               top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
               left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
             },
             rotate:get30DegRandom()
           }
        }
        if (imgsArrangeTopArr &&imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        })
  }
  //组件加载以后为每张图片计算位置范围
  componentDidMount() {
    //拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    //拿到单个图片组件的大小3
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigures0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    //计算左侧和右侧区域的位置点
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW-halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW -halfImgW;
    this.Constant.hPosRange.y[0]=-halfImgH;
    this.Constant.hPosRange.y[1]=stageH-halfImgH;
    // 计算上侧区域图片位置点
    this.Constant.vPosRange.topY[0]= - halfImgH;
    this.Constant.vPosRange.topY[1]=halfStageH - halfImgH*3;
    this.Constant.vPosRange.x[0]=halfStageW-imgW;
    this.Constant.vPosRange.x[1]=halfStageW;

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
           },
           rotate:0,//倾斜
           isInverse: false  //翻转（正反面翻转   false  --- 正面）
         }
      }
      imgFigures.push(<ImgFigure data = {value} ref={'imgFigures'+index} key={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}/>);
    });
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
