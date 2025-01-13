-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 18, 2024 at 09:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `firstname`, `lastname`, `username`, `password`) VALUES
(1, 'Pitok', 'Batolata', 'admin', '123');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `product_id`, `quantity`) VALUES
(91, 24, 33, 2),
(92, 24, 27, 2),
(93, 24, 28, 1),
(94, 24, 31, 1),
(95, 24, 35, 1),
(96, 24, 33, 1),
(97, 24, 29, 1),
(98, 24, 29, 1),
(99, 24, 32, 1),
(100, 24, 32, 1),
(101, 24, 32, 1),
(102, 24, 29, 1),
(103, 24, 29, 1),
(104, 24, 32, 1),
(105, 24, 33, 1),
(106, 24, 33, 1),
(107, 24, 33, 1),
(108, 24, 33, 1),
(109, 24, 33, 1),
(110, 24, 29, 1),
(111, 24, 28, 2),
(112, 24, 29, 2),
(113, 25, 29, 1),
(114, 24, 29, 1),
(115, 30, 32, 1),
(116, 24, 29, 1),
(117, 24, 33, 1),
(118, 24, 33, 1),
(119, 24, 33, 16),
(120, 24, 44, 1);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL,
  `admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`category_id`, `category_name`, `admin`) VALUES
(19, 'Andriod', 1),
(20, 'iOs', 1),
(21, 'Laptop', 1),
(22, 'PC', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `product_id`, `quantity`) VALUES
(241, 24, 33, 1),
(242, 24, 44, 1),
(243, 24, 33, 16),
(244, 24, 44, 16),
(245, 24, 33, 16),
(246, 24, 33, 16),
(247, 24, 44, 1),
(248, 24, 44, 1),
(249, 24, 33, 1),
(250, 24, 42, 50),
(251, 24, 29, 100),
(252, 24, 39, 20),
(253, 24, 43, 1);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_description` text NOT NULL,
  `category` int(11) NOT NULL,
  `admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `product_name`, `product_price`, `product_description`, `category`, `admin`) VALUES
(26, 'Infinix Gt20 pro', 15999.00, 'Released 2024, April 26\n194g, 8.2mm thickness\nAndroid 14, XOS 14\n256GB storage, Unspecified\n18%\n2,335,364 hits\n162\nBecome a fan\n6.78\"\n1080x2436 pixels\n108MP\n2160p\n8/12GB RAM\nDimensity 8200 Ultimate\n5000mAh\n45W', 19, 1),
(27, 'iphone 15 Pro Max', 84990.00, 'Released 2023, September 22\r\n221g, 8.3mm thickness\r\niOS 17, up to iOS 18\r\n256GB/512GB/1TB storage, no card slot\r\n29%\r\n9,506,573 hits\r\n646\r\nBecome a fan\r\n6.7\"\r\n1290x2796 pixels\r\n48MP\r\n2160p\r\n8GB RAM\r\nApple A17 Pro\r\n4441mAh\r\nPD2.015W', 20, 1),
(28, 'Samsung S24 Galaxy Ultra', 84999.00, 'Released 2024, January 24\r\n232g or 233g, 8.6mm thickness\r\nAndroid 14, up to 7 major upgrades\r\n256GB/512GB/1TB storage, no card slot\r\n54%\r\n8,870,068 hits\r\n1301\r\nBecome a fan\r\n6.8\"\r\n1440x3120 pixels\r\n200MP\r\n4320p\r\n12GB RAM\r\nSnapdragon 8 Gen 3\r\n5000mAh\r\n45W15W', 19, 1),
(29, 'apple Macbook Air M1 ', 89692.00, 'Processor: Apple M1 chip\r\nGPU: 7-core GPU\r\nRAM: 8GB unified memory\r\nRAM Slot: Configurable to 16GB\r\nSSD Storage: 256GB\r\nOS: macOS', 21, 1),
(31, 'ZTE nubia Red magic 9 pro', 46999.00, 'Released 2023, November 23\n229g, 8.9mm thickness\nAndroid 14, Redmagic OS 9\n256GB/512GB storage, no card slot\n8.3%\n1,720,367 hits\n287\nBecome a fan\n6.8\"\n1116x2480 pixels\n50MP\n4320p\n8-16GB RAM\nSnapdragon 8 Gen 3\n6500mAh\n80W', 19, 1),
(32, 'Asus ROG phone 8 pro', 60995.00, 'Released 2024, January 18\n225g, 8.9mm thickness\nAndroid 14, up to 2 major Android upgrades\n512GB/1TB storage, no card slot\n5.8%\n1,478,905 hits\n323\nBecome a fan\n6.78\"\n1080x2400 pixels\n50MP\n4320p\n16/24GB RAM\nSnapdragon 8 Gen 3\n5500mAh\n65W15W', 19, 1),
(33, 'Apple 15 Pro', 96990.00, '\n227g, 8.3mm thickness\niOS 18\n256GB/512GB/1TB storage, no card slot\n81%\n4,044,369 hits\n323\nBecome a fan\n6.9\"\n1320x2868 pixels\n48MP\n2160p\n8GB RAM\nApple A18 Pro\n4685mAh\nPD2.025W', 20, 1),
(34, 'xiaomi redmi note 14 pro', 23999.00, 'Released 2024, September 26\n210.8g, 8.7mm thickness\nAndroid 14, up to 3 major upgrades, HyperOS\n256GB/512GB storage, no card slot\n92%\n256,868 hits\n119\nBecome a fan\n6.67\"\n1220x2712 pixels\n50MP\n2160p\n12/16GB RAM\nSnapdragon 7s Gen 3\n6200mAh\n90W', 19, 1),
(35, 'Poco x6 pro', 16999.00, 'Released 2024, January 12\n186g or 190g, 8.3mm thickness\nAndroid 14, up to 3 major upgrades, HyperOS\n256GB/512GB storage, no card slot\n24%\n5,048,961 hits\n497\nBecome a fan\n6.67\"\n1220x2712 pixels\n64MP\n2160p\n8/12GB RAM\nDimensity 8300 Ultra\n5000mAh\n67W', 19, 1),
(39, 'Lenovo', 42000.00, 'most power pc', 22, 1),
(40, 'iphone 13', 31000.00, 'The iPhone 13 is the successor to Apple\'s best selling iPhone 12, a flagship processor and a 6.1-inch screen size that is not too large, nor too small.', 20, 1),
(41, 'Samsung s4pro', 2000.00, 'Good For Gaming ', 19, 1),
(42, 'Laptop', 23000.00, 'jdsjkhfuaugi', 21, 1),
(43, 'apple iphone 16 pro ', 96990.00, 'shesh', 20, 1),
(44, 'Apple Macbook Air M12', 96990.00, 'shesh', 19, 1),
(45, 'Infinix gT20 prox', 5253324.00, ' davbjkvbsvndujs', 19, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(20) NOT NULL,
  `lastname` varchar(20) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `firstname`, `lastname`, `gender`, `username`, `password`) VALUES
(24, 'Joie', 'Llegunas', 'Female', 'joie', '123'),
(25, 'Warren', 'Babaylan', 'Male', 'ren', '123'),
(30, 'Nono', 'Bagtasos', 'Male', 'non', '12345'),
(31, 'Raul', 'Smith', 'Male', 'joies', '1234');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`category_id`),
  ADD KEY `admin` (`admin`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category` (`category`),
  ADD KEY `admin` (`admin`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`);

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`category_id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`admin`) REFERENCES `admin` (`admin_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
