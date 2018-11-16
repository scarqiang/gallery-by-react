require('normalize.css/normalize.css');
// require('styles/App.css');
require('styles/main.scss');

import React from 'react';

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

class AppComponent extends React.Component {
  render() {
    return (
      // <div className="index">
      //   <img src={yeomanImage} alt="Yeoman Generator" />
      //   <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      // </div>
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
