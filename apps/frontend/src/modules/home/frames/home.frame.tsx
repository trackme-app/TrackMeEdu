import { type FC } from 'react';
import { UserTable } from '../../common/components/users/userTable.component';

export const HomeFrame: FC = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Home Page</h1>
            <UserTable />
        </div>
    );
};
