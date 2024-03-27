import React from 'react';
import './App.css';

function DrinkCard({ imageUrl, description, price }) {
  return (
    <div container>
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm">
        <img src={imageUrl} className="bd-placeholder-img card-img-top" width="200" height="200" alt="Drink" />
        <div className="card-body">
          <p className="card-text">{description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
              <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
            </div>
            <small className="text-muted">{price}원</small>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header>
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container d-flex justify-content-between">
            <a href="#" className="navbar-brand d-flex align-items-center">
              <strong>Vending Machine</strong>
            </a>
            <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row">
            <DrinkCard imageUrl="./water.png" description="물이에용!!" price={450} />
            <DrinkCard imageUrl="./coffee.png" description="아이스 아메리카노 입니다." price={500} />
            <DrinkCard imageUrl="./sports.png" description="이온 음료 입니다 ㅎㅎ" price={550} />
          </div>
          <div className="row">
            <DrinkCard imageUrl="./shake.png" description="딸기 와 우유를 섞은 딸기 쉐이크 입니다." price={700} />
            <DrinkCard imageUrl="./sports.png" description="이온음료입니다." price={750} />
            <DrinkCard imageUrl="./ade.png" description="특화 에이드" price={800} />
          </div>
        </div>
      </div>
      <footer className="text-muted">
        <div className="container">
          <p className="float-right">
            <a href="#">Back to top</a>
          </p>
          <p>Album example is © Bootstrap, but please download and customize it for yourself!</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
