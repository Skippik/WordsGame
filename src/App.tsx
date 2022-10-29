import React, {useContext, useEffect, useState} from 'react';
import 'antd/dist/antd.less';
import '../src/pages/main.less';
import CommonStore from './store/CommonStore';
import {Provider} from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';
import {ConfigProvider, Spin} from 'antd';
import Main from './pages/main';
import firebase from './fireBase';

function App() {
  //
  const storeCommon = useContext(CommonStore);
  const [loading, setLoading] = useState(false);

  const onResult = (QuerySnapshot: any) => {
    const words = QuerySnapshot.docs.map((doc: any) => doc.data());
    storeCommon.setWords(words[0].words);
  };

  const onError = (error: Error) => {
    console.log(error);
  };

  useEffect(() => {
    setLoading(true);
    const subscriber = firebase
      .firestore()
      .collection('words')
      .onSnapshot(onResult, onError);
    setLoading(false);
    return () => subscriber();
  }, []);

  return (
    <Provider storeCommon={storeCommon}>
      <BrowserRouter>
        <ConfigProvider>
          {loading ? (
            <div className='main'>
              <Spin className='s-spin'></Spin>
            </div>
          ) : (
            <Main />
          )}
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
