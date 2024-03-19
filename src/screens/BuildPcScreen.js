import React, { useState } from 'react';

import { Table, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BuildPcScrenn = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [generatedCode, setGeneratedCode] = useState('');
    const [copied, setCopied] = useState(false);

    // Hàm để tạo mã ngẫu nhiên
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setGeneratedCode(result);
    };

    // Hàm để sao chép mã
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        toast.success('Đã sao chép!');
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Hiển thị thông báo trong 3 giây và sau đó ẩn đi
    };

    const calculateTotalPrice = () => {
        // Đoạn code để tính tổng giá trị từ các thành phần khác nhau
        const components = [
            // Dữ liệu các thành phần của PC, bạn cần cập nhật lại đoạn này dựa trên dữ liệu thực tế của bạn
            { name: 'Mainboard', price: 100 },
            { name: 'CPU', price: 200 },
            { name: 'Case Cooler', price: 50 },
            { name: 'RAM', price: 80 },
            { name: 'SSD', price: 120 },
            { name: 'VGA', price: 300 },
            { name: 'Power Supply', price: 80 },
            { name: 'Case', price: 150 }
        ];

        // Tính tổng giá trị từ mảng components
        const total = components.reduce((acc, curr) => acc + curr.price, 0);

        // Cập nhật giá trị tổng
        setTotalPrice(total);
    };
    return (
        <div className="px-0 py-3 col-12">
            <style>
                {`
                    .table-custom {
                        background-color:#a8b4f7; /* Mã màu Hex */
                        /* hoặc */
                        /* background-color: navy; */ /* Tên màu CSS */
                    }
                `}
            </style>
            <Table className="table table-design table-custom">
                <thead>
                    <tr>
                        <th scope="col" width="12%">Component</th>
                        <th scope="col" width="9%">Product</th>
                        <th scope="col" width="18%">Product Link</th>
                        <th scope="col" width="7%">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/mainboard/">Mainboard</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/mainboard/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/cpu/">CPU</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/cpu/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/case-cooler/">Case Cooler</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/case-cooler/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/ram/">RAM</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/ram/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/ssd/">SSD</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/ssd/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/vga/">VGA</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/vga/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/power-supply/">Power Supply</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/power-supply/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    <tr className="items">
                        <td scope="row" className="component">
                            <a href="/product/case/">Case</a>
                        </td>
                        <td className="select-comp" colSpan="6">
                            <a className="btn btn-primary component-btn" href="/product/case/">
                                <i className="fa fa-plus"></i> ADD Component
                            </a>
                        </td>
                    </tr>
                    {/* Rest of the rows */}
                </tbody>
            </Table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button variant="primary" onClick={generateRandomCode}>General Code</Button>
                {generatedCode && (
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                        <Button variant="secondary" onClick={copyToClipboard}>{generatedCode}</Button>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default BuildPcScrenn;
