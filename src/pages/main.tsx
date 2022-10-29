import {Button, Col, Input, Modal, notification, Row, Typography} from 'antd';
import {Observer} from 'mobx-react';
import {useContext, useState} from 'react';
import CommonStore from '../store/CommonStore';
import {Word} from '../types';
import firebase from '../fireBase';
//
const {Title} = Typography;
//
const password = '123123123';

const Main = () => {
  //
  const storeCommon = useContext(CommonStore);

  //
  const [word, setWord] = useState<Word>();
  const [visible, setVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [passwordState, setPasswordStete] = useState('');

  console.log(word);

  const saveWord = () => {
    if (storeCommon.words.includes(word?.title || '')) {
      notification['error']({
        message: `Слово ${word?.title}, уже было использованно`,
        description: 'Придумайте что нибудь другое)',
      });
    } else {
      storeCommon.setWords([...storeCommon.words, word?.title || '']);
      setWord(undefined);
      notification['success']({
        message: `Слово ${word?.title}, успешно принято`,
        description: 'Молодец',
      });
      firebase.firestore().collection('words').doc('word').update({
        words: storeCommon.words,
      });
    }
  };

  return (
    <Row className='s-main'>
      <Col className='s-main__wrapper'>
        <Title>Игра Слова</Title>
        <div className='s-main__statistick'>
          <Title level={4} className='s-main__statistick-title'>
            Статистика!
          </Title>

          <Observer>
            {() => {
              return (
                <>
                  <Title
                    level={5}
                    className='s-main__statistick-number'>{`Колличество уникальных слов: ${
                    storeCommon.words.length ? storeCommon.words.length : 0
                  }`}</Title>
                  <Title level={5}>
                    {!!storeCommon.words.length
                      ? `Последнее слово ${
                          storeCommon.words[storeCommon.words.length - 1]
                        }`
                      : 'Начните играть'}
                  </Title>
                </>
              );
            }}
          </Observer>
        </div>
        <div className='s-main__input-wrapper'>
          <Input
            value={word?.title || ''}
            allowClear={true}
            onChange={word => {
              setWord(w => ({
                ...w,
                title: word.target.value,
              }));
            }}
            className='s-main__input'
            placeholder={'Введите слово!'}
          />
          <Button onClick={saveWord} className='s-main__btn'>
            {'Отправить!'}
          </Button>
          <Observer>
            {() => (
              <>
                {!!storeCommon.words.length && (
                  <Button
                    type='primary'
                    className='b-all'
                    onClick={() => setVisible(true)}>
                    Посмотреть все уникальные слова
                  </Button>
                )}
              </>
            )}
          </Observer>
          <Button
            onClick={() => {
              setSettingVisible(true);
            }}
            style={{marginTop: 20}}
            type='primary'>
            Настройки
          </Button>
        </div>
        <Modal
          width={300}
          footer={false}
          title={'Все слова'}
          open={visible}
          onCancel={() => {
            setVisible(false);
          }}>
          <Observer>
            {() => (
              <div className='s-words__wrapper'>
                {storeCommon.words.map((w, key) => (
                  <Title key={key} level={5}>
                    {`Слово №${key + 1}: ${w}`}
                  </Title>
                ))}
              </div>
            )}
          </Observer>
        </Modal>
        <Modal
          width={300}
          footer={false}
          title={'Настройки'}
          open={settingVisible}
          onCancel={() => {
            setSettingVisible(false);
          }}>
          <>
            {passwordState === password ? (
              <Button
                onClick={() => {
                  localStorage.removeItem('words');
                  storeCommon.setWords([]);
                  firebase.firestore().collection('words').doc('word').update({
                    words: storeCommon.words,
                  });
                  setSettingVisible(false);
                  setPasswordStete('');
                }}
                type='primary'>
                Сбросить все слова
              </Button>
            ) : (
              <>
                <Title level={4}>Введите пароль</Title>
                <Input.Password
                  onChange={pass => {
                    setPasswordStete(pass.target.value);
                  }}
                  placeholder={'Пароль'}
                />
              </>
            )}
          </>
        </Modal>
      </Col>
    </Row>
  );
};

export default Main;
