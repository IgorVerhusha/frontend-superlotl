import React from 'react';
import cn from 'classnames'
import { tableData } from './Data';

import styles from './table.module.scss';

export const TableWithoutHeader = ({ rowsTable }) => {
  return (
    <table className={styles.tableWrapper}>
      <tbody>
        {rowsTable.map((item) => {
          return (
            <tr key={item.id}>
              <td className={cn(styles.sTd, styles.num)}>{item.id}</td>
              {tableData(item).map(({ headerValue, rowValue }, i) => {
                return (
                  <td className={styles.sTd} key={`${item.id}_${i}`}>
                    {rowValue}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
