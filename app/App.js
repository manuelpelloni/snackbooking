import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Layout } from 'antd';
import Login from "./Components/Login"

const { Header, Content, Footer, Sider } = Layout;
function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <body>
      <Layout>
        <Header></Header>
      <Layout>
        <Content><Login/></Content>
      </Layout>
        <Footer></Footer>
      </Layout>
      </body>
    </div>
  );
}

export default App;
