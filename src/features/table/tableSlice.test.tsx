import tableSlice, { deleteMultipleUsers, deleteUser, editUser, TableState, User } from "./tableSlice";

describe('Table view component', () => {
  const intialState: TableState = {
    value: [] as User[],
    status: 'idle'
  }
  const successState: TableState = {
    value: [
      {
        name: "Joni Baez",
        id: "1",
        email: "abc@def.com",
        role: 'engineer'
      },
      {
        name: "Benz paul",
        id: "2",
        email: "bez@pau.com",
        role: 'manager'
      }
    ] as User[],
    status: 'success'
  };
  const editUserData = {
    name: "Baez Joni",
    id: "1",
    email: "abc@alpha.com",
    role: 'engineer'
  }
  it('should handle initial state', () => {
    expect(tableSlice(undefined, { type: 'unknown' })).toEqual({
      value: [],
      status: 'idle',
    });
  });
  it('should handle editUser', () => {
    const actual = tableSlice(successState, editUser(editUserData));
    expect(actual.value.filter(user => user.id === editUserData.id)).toEqual([editUserData]);
  });
  it('should handle deleteUser', () => {
    const actual = tableSlice(successState, deleteUser(editUserData.id));
    expect(actual.value.length).toEqual(1);
  });

  it('should handle deleteMultipleUsers', () => {
    const actual = tableSlice(successState, deleteMultipleUsers(['1', '2']));
    expect(actual.value).toEqual([]);
  });
});