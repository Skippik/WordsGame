import {createContext} from 'react';
import {action, observable, makeObservable} from 'mobx';

class CommonStore {
  //
  words: string[] = [];
  //
  constructor() {
    makeObservable(this, {
      loading: observable,
      setLoading: action.bound,
      words: observable,
    });
    this.words = JSON.parse(localStorage.getItem('words') || '[]');
  }

  loading = false;

  setWords = (newWord: string[]) => {
    this.words = newWord;

    localStorage.setItem('words', JSON.stringify(this.words));
  };

  setLoading = (
    loading: boolean,
    color: string | null = null,
    size: number | null = null,
  ) => {
    this.loading = loading;
  };
}

export default createContext(new CommonStore());
