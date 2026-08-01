/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {useState} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

const FIELDS = [
    {
        key: 'name',
        type: 'String',
        header: 'Name',
        align: 'left',
        values: ['Ada', 'Lin', 'Sun', 'Rui'],
    },
    {
        key: 'date',
        type: 'Date',
        header: 'Date',
        align: 'right',
        values: ['2026-07-28', '2026-07-28', '2026-07-29', '2026-07-30'],
    },
    {
        key: 'amount',
        type: 'Double',
        header: 'Amount',
        align: 'right',
        values: ['0.56', '1.20', '4.80', '2.35'],
    },
    /* Annotated @ExcelIgnore, so it never reaches the sheet. */
    {
        key: 'note',
        type: 'String',
        ignored: true,
    },
];

const COLUMNS = FIELDS.filter((field) => !field.ignored);
const ROW_COUNT = 4;

/* Empty rows below the data, so the pane reads as a sheet rather than stopping short. */
const FILLER_ROWS = 1;

function columnLetter(index) {
    return String.fromCharCode(65 + index);
}

export default function HeroPlayground() {
    const [activeKey, setActiveKey] = useState(null);

    const link = (key) => ({
        onMouseEnter: () => setActiveKey(key),
        onMouseLeave: () => setActiveKey(null),
    });

    return (
        <div className={styles.playground}>
            <div className={styles.panes}>
                <div className={styles.codePane}>
                    <div className={styles.paneLabel}>DemoData.java</div>
                    <pre className={styles.code}>
                        <code>
                            <span className={styles.punctuation}>class </span>
                            DemoData {'{'}
                            {FIELDS.map((field) => (
                                <span
                                    key={field.key}
                                    className={clsx(
                                        styles.field,
                                        activeKey === field.key && styles.fieldActive,
                                    )}
                                    {...link(field.key)}>
                                    <span className={styles.annotationLine}>
                                        {field.ignored ? (
                                            <span className={styles.annotation}>@ExcelIgnore</span>
                                        ) : (
                                            <>
                                                <span className={styles.annotation}>
                                                    @ExcelProperty
                                                </span>
                                                {'("'}
                                                <span className={styles.headerLiteral}>
                                                    {field.header}
                                                </span>
                                                {'")'}
                                            </>
                                        )}
                                    </span>
                                    <span className={styles.declaration}>
                                        <span className={styles.punctuation}>private </span>
                                        {field.type} {field.key};
                                    </span>
                                </span>
                            ))}
                            {'}'}
                        </code>
                    </pre>
                </div>

                <div className={styles.sheetPane}>
                    <div className={styles.paneLabel}>demo.xlsx</div>
                    <div className={styles.sheetScroll}>
                        <table className={styles.sheet}>
                            <caption className={styles.srOnly}>
                                <Translate id="homepage.playground.sheet.caption">
                                    The spreadsheet Fesod writes from the class beside it
                                </Translate>
                            </caption>
                            <thead>
                                <tr className={styles.gutterRow}>
                                    <td className={styles.corner} />
                                    {COLUMNS.map((field, index) => (
                                        <td
                                            key={field.key}
                                            className={clsx(
                                                styles.columnLetter,
                                                activeKey === field.key && styles.columnLetterActive,
                                            )}>
                                            {columnLetter(index)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className={styles.rowNumber}>1</td>
                                    {COLUMNS.map((field) => (
                                        <th
                                            key={field.key}
                                            scope="col"
                                            className={clsx(
                                                styles.headerCell,
                                                activeKey === field.key && styles.cellActive,
                                            )}
                                            style={{textAlign: field.align}}
                                            {...link(field.key)}>
                                            {field.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({length: ROW_COUNT}, (_, row) => (
                                    <tr key={row}>
                                        <td className={styles.rowNumber}>{row + 2}</td>
                                        {COLUMNS.map((field) => (
                                            <td
                                                key={field.key}
                                                className={clsx(
                                                    styles.cell,
                                                    activeKey === field.key && styles.cellActive,
                                                )}
                                                style={{textAlign: field.align}}
                                                {...link(field.key)}>
                                                {field.values[row]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {Array.from({length: FILLER_ROWS}, (_, row) => (
                                    <tr key={`filler-${row}`} aria-hidden="true">
                                        <td className={styles.rowNumber}>
                                            {ROW_COUNT + row + 2}
                                        </td>
                                        {COLUMNS.map((field) => (
                                            <td
                                                key={field.key}
                                                className={clsx(
                                                    styles.cell,
                                                    activeKey === field.key && styles.cellActive,
                                                )}
                                                {...link(field.key)}>
                                                &nbsp;
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.sheetTab}>Template</div>
                </div>
            </div>

            <div className={styles.statusBar}>
                <code>
                    FesodSheet.write(&quot;demo.xlsx&quot;, DemoData.class).sheet(&quot;Template&quot;).doWrite(data());
                </code>
            </div>

            <p className={styles.hint}>
                <Translate id="homepage.playground.hint">
                    Every @ExcelProperty becomes a column header.
                </Translate>
            </p>
        </div>
    );
}
