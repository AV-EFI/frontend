//handled by autoImport
import {defineStore} from 'pinia';

export const useCounterStore = defineStore({
    id: 'counter',
    state: () => ({
        count: 0,
        name: 'JDoe',
        username: 'jdoe',
        users: [] as UserInfo[]
    }),
    actions: {
        incCount() {
            this.count++;
        },
        decCount() {
            this.count--;
        },
        /*
        async fetchUsers() {
            try {
                const data = await axios.get('https://jsonplaceholder.typicode.com/users');
                this.users = data.data;
            }
            catch (error) {
                alert(error);
                console.log(error);
            }
        }
        */
    },
    getters: {
        oddEven: (state) => {
            if (state.count % 2 === 0) {
                return 'even';
            }
            return 'odd';
        },
        getUsers: (state) => {
            return state.users;
        }
    }
});

interface UserInfo {
  id: number,
  name: string,
  address: string,
  age: number|null
}
