import {
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  notification,
  Radio,
  Row,
  Typography,
} from 'antd';
import {Observer} from 'mobx-react';
import {useContext, useState} from 'react';
import CommonStore from '../store/CommonStore';
import {User, Word} from '../types';
import firebase from '../fireBase';
import {Config} from '../Config';
import {toJS} from 'mobx';

//
const {Title} = Typography;
//
const password = '123123123';
//
const element = document.querySelector('#s-main');

const Main = () => {
  //
  const storeCommon = useContext(CommonStore);

  //
  const [word, setWord] = useState<Word>();
  const [user, setUser] = useState<User>();
  const [visible, setVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [settingVisible, setSettingVisible] = useState(false);
  const [passwordState, setPasswordStete] = useState('');

  console.log('user', toJS(storeCommon.user));

  const saveUser = () => {
    if (!user) {
      notification['error']({
        message: 'Ошибка',
        description: 'Упс',
      });
    } else {
      storeCommon.setUser(user);
      notification['success']({
        message: `Пользователь ${user.name} успешно сохранён`,
        description: 'Молодец',
      });
      setNameVisible(false);
    }
  };

  const saveWord = () => {
    if (storeCommon.words.includes(word?.title || '')) {
      notification['error']({
        message: `Слово ${word?.title}, уже было использованно`,
        description: 'Придумайте что нибудь другое)',
      });
    } else if (word?.title === undefined) {
      notification['error']({
        message: `Пусто ты чё)`,
        description: 'совсем тю тю?',
      });
    } else {
      storeCommon.setWords([...storeCommon.words, word?.title || '']);
      setWord(undefined);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      } else {
        window.scrollTo({top: 0});
      }
      notification['success']({
        message: `Слово ${word?.title}, успешно принято`,
        description: 'Молодец',
      });
      //prod
      // firebase.firestore().collection('words').doc('word').update({
      //   words: storeCommon.words,
      // });
      //test
      firebase.firestore().collection('test').doc('test').update({
        test: storeCommon.words,
      });
    }
  };

  return (
    <Row className='s-main' id='s-main'>
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
          <Button type='primary' onClick={saveWord} className='s-main__btn'>
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
          <Button
            onClick={() => {
              setNameVisible(true);
            }}
            style={{marginTop: 20}}
            type='primary'>
            Регистрация
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
          title={'Регистрация'}
          open={nameVisible}
          onCancel={() => {
            setNameVisible(false);
          }}>
          <Input
            placeholder='Введите имя'
            onChange={name => {
              setUser(
                n =>
                  ({
                    ...(n || ''),
                    name: name.target.value,
                  } as User),
              );
            }}
          />
          <Title level={4}>Выберите тему</Title>
          <div className='s-user__wrapper'>
            <Radio.Group
              className='s-radio__wrapper'
              onChange={theme => {
                setUser(
                  t =>
                    ({
                      ...(t || ''),
                      color: theme.target.value,
                    } as User),
                );
              }}
              value={user?.color}>
              {Config.themes.map(t => (
                <Radio className='s-radio__wrapper-item' value={t.color}>
                  <div
                    className='s-radio-box'
                    style={{backgroundColor: t.color}}
                  />
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <Button
            style={{marginTop: 20}}
            type='primary'
            onClick={() => {
              saveUser();
            }}>
            Cохранить
          </Button>
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
