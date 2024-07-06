import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import Navbar from './Navbar.jsx';

const EntradaReporte = () => {
  const [entradas, setEntradas] = useState([]);

  useEffect(() => {
    fetchEntradas();
  }, []);

  const fetchEntradas = async () => {
    try {
      const response = await fetch('http://localhost:4000/entradas');
      const data = await response.json();
      setEntradas(data.entradas);
    } catch (error) {
      console.error('Error fetching entradas:', error);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID Entrada", "Cantidad Entrada", "Fecha Entrada", "Categoria", "Proveedor", "Producto", "Gestionada por"];
    const tableRows = [];

    entradas.forEach(entrada => {
      const entradaData = [
        entrada.id_entrada,
        entrada.cantidad_entrada,
        new Date(entrada.fecha_entrada).toLocaleDateString(),
        entrada.nombre_categoria,
        entrada.nombre_proveedor,
        entrada.nombre_producto,
        entrada.gestionada_por
      ];
      tableRows.push(entradaData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Reporte de Entradas", 14, 15);
    doc.save('entradas_reporte.pdf');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: '20px' }}>
        <h1>Reporte de Entradas</h1>
        <Button variant="contained" color="primary" onClick={downloadPDF} sx={{ marginRight: '1rem' }}>
          Descargar PDF
        </Button>
        <Button variant="contained" color="secondary">
          <CSVLink
            data={entradas}
            filename={"entradas_reporte.csv"}
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Descargar CSV
          </CSVLink>
        </Button>
        <TableContainer component={Paper} sx={{ marginTop: '1rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Entrada</TableCell>
                <TableCell>Cantidad Entrada</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Proveedor</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Gestionada por</TableCell>
                <TableCell>Fecha Entrada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entradas.map((entrada) => (
                <TableRow key={entrada.id_entrada}>
                  <TableCell>{entrada.id_entrada}</TableCell>
                  <TableCell>{entrada.cantidad_entrada}</TableCell>
                  <TableCell>{entrada.nombre_categoria}</TableCell>
                  <TableCell>{entrada.nombre_proveedor}</TableCell>
                  <TableCell>{entrada.nombre_producto}</TableCell>
                  <TableCell>{entrada.gestionada_por}</TableCell>
                  <TableCell>{new Date(entrada.fecha_entrada).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default EntradaReporte;
