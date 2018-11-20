require('normalize.css/normalize.css');
// require('styles/App.css');
require('styles/main.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// let yeomanImage = require('../images/yeoman.png');

// 获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片信息转换成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (let i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImagaeData = imageDatasArr[i];
    singleImagaeData.imageURL = require('../images/' + singleImagaeData.fileName);
    imageDatasArr[i] = singleImagaeData;
  }

  return imageDatasArr;
})(imageDatas);

/*
获取区间内的一个随机值
*/
function  getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

// 获取 0 - 30° 之前的一个任意正负值
function get30DegRandom() {
   return (Math.random() > 0.5 ? '': '-') + Math.ceil(Math.random() * 30);
}

class ImageFigure extends React.Component {

    /*
     * imgFigure的点击处理函数
     */
    handleClick(e) {

      if (this.props.arrange.isCenter == true) {
        this.props.inverse();
      }
      else {
        this.props.center();
      }

      e.stopPropagation();
      e.preventDefault();
    }

    render() {
      var styleObj = {};

      //如果props属性中指定了这张图片的位置， 则使用
      if (this.props.arrange.pos) {
        styleObj = this.props.arrange.pos;
      }

      //如果图片的旋转角度有值并且不为0，添加旋转角度
      if (this.props.arrange.rotate) {
        //css样式对象的key用样式名的驼峰标识写法， 值是用样式的值，这里ms特殊不需要大写
        (['MozTransform', 'msTransform', 'WebkitTransform', '']).forEach(function (value) {
          styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
        }, this);
      }

      if (this.props.arrange.isCenter) {
        //zIndex在scss文件中相当与z-index
        styleObj.zIndex = 11;
      }

      var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

      return (
        <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
          <img className="img" src={this.props.data.imageURL} alt={this.props.data.title}/>
  
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
            <div className="img-back">
              <p>
                {this.props.data.desc}
              </p>
            </div>
          </figcaption>
        </figure>
      );
    }
}


class ControllerUnit extends React.Component {
  handleClick(e) {

    //如果点击的是当前正在选中态的按钮，则翻转图片，否则将对应的图片居中
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    }
    else {
      this.props.center();
    }

    e.preventDefault();
    e.stopPropagation;
  }

  render() {

    var controllerUnitClassName = 'controller-unit';

    //如果对应的是军中的图片，显示控制按钮的居中态
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center';
      
      //如果同时对应的是翻转图片，显示控制按钮的翻转态
      if(this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }



    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    )
  }
}

class AppComponent extends React.Component {

  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPostRange: { //水平方向的取值范围
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPostRange: {// 垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  }

  /*
  * 翻转图片
  * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
  * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
  */
  inverse(index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      // alert('you trigger inverse function');
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  }
  
  /*
    重新布局所有图片
    @param centerIndex 指定居中排布哪个图片
   */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPostRange = Constant.hPostRange,
        vPostRange = Constant.vPostRange,
        hPostRangeLeftSecX = hPostRange.leftSecX,
        hPostRangeRightSecX = hPostRange.rightSecX,
        hPostRangeY = hPostRange.y,
        vPostRangeTopY = vPostRange.topY,
        vPostRangeX = vPostRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
        topImgSpliceIndex = 0,

        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中 centerIndex 图片
    imgsArrangeCenterArr[0]=  {
      pos: centerPos,
      rotate: 0,//居中的centerIndex 的图片不需要旋转
      isCenter: true
    };

    
    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
 
    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos:{
          top: getRangeRandom(vPostRangeTopY[0], vPostRangeTopY[1]),
          left: getRangeRandom(vPostRangeX[0], vPostRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    });

     //布局左右两侧的图片
     for (let i = 0, j= imgsArrangeArr.length, k = j / 2; i < j; i++) {
       var hPostRangeLORX = null;
       //前半部分布局左边，右半部分布局右边
       if (i < k) {
         hPostRangeLORX = hPostRangeLeftSecX;
       }
       else {
         hPostRangeLORX = hPostRangeRightSecX;
       }

        imgsArrangeArr[i] = {
          pos : {
            top: getRangeRandom(hPostRangeY[0], hPostRangeY[1]),
            left: getRangeRandom(hPostRangeLORX[0], hPostRangeLORX[1])
          },
          rotate: get30DegRandom(),
          isCenter: false
        };
     }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
     }
     
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }

  /*
   * 利用rearrange函数，居中对应index的图片
   * @param index，需要被居中的图片对应的图片信息数组的index值
   * @return {Function}
   */
  center(index) {
    return function () {
      // alert('you trigger center function');
      this.rearrange(index);
    }.bind(this);
  }

  constructor(props) {
    super(props);

    this.state = {
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          },
          rotate: 0, //旋转角度
          isInverse: false, //图片正反面
          isCenter: false //图片是否居中
        }*/
      ]
     };

  }

  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    //首先拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

   // 计算中心图片的位置点
    // this.Constant.centerPos = {
    //   left: halfStageW - halfImgW,
    //   top: halfStageH - halfImgH
    // };

    //计算左侧，右侧区域图片排布位置的取值范围
    // this.Constant.hPostRange.leftSecX[0] = -halfImgW;
    // this.Constant.hPostRange.leftSecX[1] = halfStageW - halfImgW *3;
    // this.Constant.hPostRange.rightSecX[0] = halfStageW + halfImgW;
    // this.Constant.hPostRange.rightSecX[1] = stageW - halfImgW;
    // this.Constant.hPostRange.y[0] = -halfImgH;
    // this.Constant.hPostRange.y[1] = stageH - halfImgH;

    // // 计算上测区域图片排布位置的取值范围
    // this.Constant.vPostRange.topY[0] = -halfImgH;
    // this.Constant.vPostRange.topY[1] = halfStageH - halfImgH * 3;
    // this.Constant.vPostRange.x[0] = halfImgW - imgW;
    // this.Constant.vPostRange.vPostRange.x[1] = halfImgW;


    this.Constant = {
      centerPos: {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      },
      hPostRange: { //水平方向的取值范围
        leftSecX: [-halfImgW, halfStageW - halfImgW * 3],
        rightSecX: [halfStageW + halfImgW, stageW - halfImgW],
        y: [-halfImgH, stageH - halfImgH]
      },
      vPostRange: {// 垂直方向的取值范围
        x: [halfStageW - imgW, halfStageW],
        topY: [-halfImgH, halfStageH - halfImgH * 3]
      }
    };

    this.rearrange(0);
  }

  render() {

    var controllerUnit = [], imgFigures = [];

    imageDatas.forEach(function (value, index) {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top:0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        };
      }

      //元素添加key值，复用组件，减少react性能消耗
      imgFigures.push(<ImageFigure key={index} data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index).bind(this)} center={this.center(index).bind(this)}/>);
      controllerUnit.push(<ControllerUnit key={key} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index).bind(this)} center={this.center(index).bind(this)}/>)
    }, this);

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnit}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
