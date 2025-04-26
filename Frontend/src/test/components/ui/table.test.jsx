import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../../../components/ui/table';

describe('Table UI components', () => {
  it('Table renders wrapper div and a <table> with merged classes and props', () => {
    const { container } = render(
      <Table className="custom" data-testid="tbl">
        <TableCaption>My Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>H1</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Cell1</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );

    // wrapper div
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('relative w-full overflow-auto');

    // the <table>
    const table = screen.getByTestId('tbl');
    expect(table.tagName).toBe('TABLE');
    expect(table).toHaveClass('w-full caption-bottom text-sm custom');

    // children rendered
    expect(screen.getByText('My Caption')).toBeInTheDocument();
    expect(screen.getByText('H1')).toBeInTheDocument();
    expect(screen.getByText('Cell1')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('TableHeader renders a <thead> with default and custom classes', () => {
    render(
      <table>
        <TableHeader className="hdr" data-testid="hdr">
          <tr><th>Header</th></tr>
        </TableHeader>
      </table>
    );
    const thead = screen.getByTestId('hdr');
    expect(thead.tagName).toBe('THEAD');
    expect(thead).toHaveClass('border-b bg-transparent hdr');
    expect(screen.getByText('Header')).toBeInTheDocument();
  });

  it('TableBody renders a <tbody> with default and custom classes', () => {
    render(
      <table>
        <TableBody className="bod" data-testid="bod">
          <tr><td>Body</td></tr>
        </TableBody>
      </table>
    );
    const tbody = screen.getByTestId('bod');
    expect(tbody.tagName).toBe('TBODY');
    expect(tbody).toHaveClass('divide-y bod');
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('TableFooter renders a <tfoot> with default and custom classes', () => {
    render(
      <table>
        <TableFooter className="ftr" data-testid="ftr"/>
      </table>
    );
    const tfoot = screen.getByTestId('ftr');
    expect(tfoot.tagName).toBe('TFOOT');
    expect(tfoot).toHaveClass('border-t bg-muted font-medium ftr');
  });

  it('TableRow renders a <tr> with default and custom classes', () => {
    render(
      <table>
        <tbody>
          <TableRow className="row" data-testid="row">
            <td>R</td>
          </TableRow>
        </tbody>
      </table>
    );
    const tr = screen.getByTestId('row');
    expect(tr.tagName).toBe('TR');
    expect(tr).toHaveClass('border-b hover:bg-muted row');
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('TableHead renders a <th> with default and custom classes', () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHead className="hd" data-testid="hd">Col</TableHead>
          </tr>
        </thead>
      </table>
    );
    const th = screen.getByTestId('hd');
    expect(th.tagName).toBe('TH');
    expect(th).toHaveClass('px-4 py-2 text-left font-medium text-foreground hd');
    expect(th).toHaveTextContent('Col');
  });

  it('TableCell renders a <td> with default and custom classes', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="cd" data-testid="cd">Data</TableCell>
          </tr>
        </tbody>
      </table>
    );
    const td = screen.getByTestId('cd');
    expect(td.tagName).toBe('TD');
    expect(td).toHaveClass('px-4 py-2 cd');
    expect(td).toHaveTextContent('Data');
  });

  it('TableCaption renders a <caption> with default and custom classes', () => {
    render(
      <table>
        <TableCaption className="cap" data-testid="cap">Cap</TableCaption>
      </table>
    );
    const caption = screen.getByTestId('cap');
    expect(caption.tagName).toBe('CAPTION');
    expect(caption).toHaveClass('mt-2 text-sm text-gray-500 cap');
    expect(caption).toHaveTextContent('Cap');
  });
});
