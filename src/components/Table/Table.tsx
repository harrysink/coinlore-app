import { useEffect, useState } from "react";
import { useReactTable, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { defaultData } from "../data/data";

const Table = () => {
    const [data, setData] = useState<defaultData[]>([]);
    
    useEffect(() => {
        const apiUrl = 'https://api.coinlore.net/api/tickers/'
        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not okay')
                }
                return res.json();
            })
            .then(data => {
                setData(data.data)
                console.log('Data: ', data);
            })
            .catch(error => {
                console.error('Error: ', error)
            });
    }, [])

    const columnHelper = createColumnHelper<defaultData>();
    const columns = [
        columnHelper.accessor('name', {
            cell: (info) => info.getValue(),
            header: () => <span>💰Coin</span>
        }),
        columnHelper.accessor('symbol', {
            cell: (info) => info.getValue(),
            header: () => <span>📄Code</span>
        }),
        columnHelper.accessor('price_usd', {
            cell: (info) => info.getValue(),
            header: () => <span>🤑Price</span>
        }),
        columnHelper.accessor('tsupply', {
            cell: (info) => (<>{info.getValue()} {info.row.original.symbol}</>),
            header: () => <span>📈Total Supply</span>
        }),
    ]

    const table = useReactTable({
       data: data, 
       columns, 
       getCoreRowModel: getCoreRowModel(),
       getPaginationRowModel: getPaginationRowModel(),
       
    })

    return (
        <div className="justify-items-center items-center w-[100%]">
            <table className="border text-left shadow-lg mt-3 mb-3 mx-auto w-[95%] text-sm">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th className="text-left pt-2 pb-2 pl-2 mr-5" key={header.id}>
                                    {header.isPlaceholder 
                                      ? null 
                                      : flexRender (
                                          header.column.columnDef.header,
                                          header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className={`${row.index % 2 !== 0 ? "bg-[#FFFFFF]" : "bg-[#E4E4E4]"}`}>
                            {row.getVisibleCells().map(cell => (
                                <td className="pt-2 pb-2 pl-4 pr-4" key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                {/* pagination buttons */}
                <div className="flex w-full relative px-4">
                    <button
                        className="font-bold pt-2 pb-2 pr-4" 
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        hidden={!table.getCanPreviousPage()}
                    >
                        Previous
                    </button>
                    <button 
                        className="font-bold pt-2 pb-2 pl-4 pr-4" 
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        hidden={!table.getCanNextPage()}
                    >
                        Next 
                    </button>
                </div>
            </table>
        </div>
    );
}

export default Table;