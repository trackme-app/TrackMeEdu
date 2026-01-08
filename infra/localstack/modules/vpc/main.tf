############################
# VPC
############################

resource "aws_vpc" "this" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Project = "TME"
    Name    = "tme-test-vpc"
  }
}

############################
# Internet Gateway
############################

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = {
    Name = "tme-test-igw"
  }
}

############################
# Public Subnets (2 AZs)
############################

resource "aws_subnet" "public" {
  count = 2

  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet("10.0.0.0/16", 8, count.index)
  availability_zone       = "us-east-1${element(["a", "b"], count.index)}"
  map_public_ip_on_launch = true

  tags = {
    Name    = "tme-public-${count.index}"
    Project = "TME"
  }
}

############################
# Private Subnets (2 AZs)
############################

resource "aws_subnet" "private" {
  count = 2

  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet("10.0.0.0/16", 4, count.index + 4)
  availability_zone = "us-east-1${element(["a", "b"], count.index)}"

  tags = {
    Name    = "tme-private-${count.index}"
    Project = "TME"
  }
}

############################
# NAT Gateway (single)
############################

resource "aws_eip" "nat" {
  count = 1
  domain   = "vpc"
}

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat[0].id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "tme-nat"
  }

  depends_on = [aws_internet_gateway.this]
}

############################
# Route Tables
############################

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = {
    Name = "tme-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.this.id
  }

  tags = {
    Name = "tme-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
