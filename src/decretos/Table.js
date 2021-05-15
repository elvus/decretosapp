import React from 'react';
import { useState, useEffect } from 'react';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow, MDBContainer, MDBInput, MDBBtn } from 'mdbreact';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'

import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableContainer from '@material-ui/core/TableContainer';

const DatatablePage = () => {
   // We'll start our table without any data
  const [items, setItems] = useState([])
  const columns = React.useMemo(() => [
    {
      Header: 'Nro',
      accessor: 'nro',
    },
    {
      Header: 'Fecha',
      accessor: 'fecha',
    },
    {
      Header: 'Decreto',
      accessor: 'descripcion',
      Cell:({ cell }) => (<span>
          {cell.row.values.descripcion.substring(cell.row.values.descripcion.indexOf(":")+1)}
          </span>
      )
    },
    {
      Header: 'Url',
      accessor: 'link',
      disableSortBy: true,
      Cell:({cell})=>(<MDBBtn
                href={cell.row.values.link}
                target="_blank"
                color="primary"
                size="sm"
              >
                Ver
              </MDBBtn>
      )
    }
  ],[])

  function Table({ 
    columns, 
    data,
    pageCount: controlledPageCount, }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      setGlobalFilter,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      state: { pageIndex, globalFilter },
    } = useTable(
      {
        columns,
        data,
        initialState: { 
          pageIndex: 0,
          sortBy: [{ id: "nro", desc: true }]
        }, // Pass our hoisted table state
      },useGlobalFilter,
      useSortBy,
      usePagination
      
    )
  
    return (
      <>
      <MDBRow className="float-right">
        <MDBCol>
            <MDBInput label="Buscar" value={globalFilter || ""}
            onChange={e=> setGlobalFilter(e.target.value)} />
        </MDBCol >
      </MDBRow>
      <TableContainer className="px-md-10">
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map(headerGroup => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <TableCell {...column.getSortByToggleProps()}>
                    {/* Add a sort direction indicator */}
                    <span>
                        {!column.disableSortBy?
                            column.isSorted
                              ? column.isSortedDesc
                                ? <FontAwesomeIcon icon={faSortDown} />
                                : <FontAwesomeIcon icon={faSortUp} />
                              : <FontAwesomeIcon icon={faSort} />
                          :''}
                    </span> {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map(
              (row, i) => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <TableCell {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              }
            )}
          </TableBody>
        </MaUTable>
      </TableContainer>
      <br/>
      <MDBRow className="float-right">
        <MDBCol size="6">
          <MDBPagination className="mb-5">
            <MDBPageItem onClick={()=>previousPage()} disabled={!canPreviousPage}>
              <MDBPageNav aria-label="Anterior">
                <span aria-hidden="true">Anterior</span>
              </MDBPageNav>
            </MDBPageItem>
            {pageOptions.map(i => {
              let pageItem;
              if(pageIndex<4){
                if(pageIndex<=4 && i<=4){
                  if(pageIndex===i){
                    pageItem = <MDBPageItem active>
                                <MDBPageNav >
                                  {i+1}
                                </MDBPageNav>
                              </MDBPageItem>
                  }else{
                    pageItem = <MDBPageItem onClick={() => gotoPage(i)}>
                                <MDBPageNav >
                                  {i+1}
                                </MDBPageNav>
                              </MDBPageItem>
                  }
                } else if(i===pageOptions.length-1){
                  pageItem = <>
                                <MDBPageItem >
                                  <MDBPageNav >
                                    ...
                                  </MDBPageNav>
                                </MDBPageItem>
                                <MDBPageItem onClick={() => gotoPage(i)}>
                                  <MDBPageNav >
                                    {pageOptions.length}
                                  </MDBPageNav>
                                </MDBPageItem>
                              </> 
                }  
              } else {
                if(i===0){
                  pageItem = <>
                                <MDBPageItem onClick={() => gotoPage(i)}>
                                  <MDBPageNav >
                                    {i+1}
                                  </MDBPageNav>
                                </MDBPageItem>
                                <MDBPageItem >
                                  <MDBPageNav >
                                    ...
                                  </MDBPageNav>
                                </MDBPageItem>
                              </>   
                }else if(pageIndex>=4 && i<pageIndex+3){
                  if(pageIndex+3<pageOptions.length){
                    if(i===pageIndex){
                      pageItem = <>
                                    <MDBPageItem >
                                      <MDBPageNav onClick={() => gotoPage(i)}>
                                        {i}
                                      </MDBPageNav>
                                    </MDBPageItem>
                                    <MDBPageItem active>
                                      <MDBPageNav >
                                        {i+1}
                                      </MDBPageNav>
                                    </MDBPageItem>
                                    <MDBPageItem onClick={() => gotoPage(i+1)}>
                                      <MDBPageNav >
                                        {i+2}
                                      </MDBPageNav>
                                    </MDBPageItem>
                                  </>
                    }     
                  }else if(i+1>pageCount-3){
                    if(pageIndex===i){
                      pageItem = <MDBPageItem active>
                                    <MDBPageNav >
                                      {i+1}
                                    </MDBPageNav>
                                  </MDBPageItem>
                    }else{
                      pageItem = <MDBPageItem onClick={() => gotoPage(i)}>
                                    <MDBPageNav >
                                      {i+1}
                                    </MDBPageNav>
                                  </MDBPageItem>
                    }
                  }                   
                } else if(i===pageOptions.length-1){
                  pageItem = <>
                                <MDBPageItem >
                                  <MDBPageNav >
                                    ...
                                  </MDBPageNav>
                                </MDBPageItem>
                                <MDBPageItem onClick={() => gotoPage(i)}>
                                  <MDBPageNav >
                                    {pageOptions.length}
                                  </MDBPageNav>
                                </MDBPageItem>
                              </>
                }                  
              }
              return pageItem;
            })}
            <MDBPageItem onClick={()=>nextPage()} disabled={!canNextPage}>
              <MDBPageNav aria-label="Siguiente">
                <span aria-hidden="true">Siguiente</span>
              </MDBPageNav>
            </MDBPageItem>
          </MDBPagination>
        </MDBCol>
      </MDBRow>
      <p className="text-muted">
        Página {pageIndex+1} de {pageOptions.length}
      </p>
      </>
    )
  }

  useEffect(() => {
    fetch("https://decretos.datospy.org/api/all")
      .then(res => res.json())
      .then(
        (result) => {
          setItems(result);
        },
      )
  }, [])
  
  return (
    <MDBContainer>
      <Table 
        columns={columns}
        data={items}
      />
    </MDBContainer>
    
  );
}

export default DatatablePage;