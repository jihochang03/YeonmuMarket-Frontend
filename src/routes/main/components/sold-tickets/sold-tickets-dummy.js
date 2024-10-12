import image from '../../../../assets/icons/photo-upload.png';

export const soldTickets = [
  {
    id: 1,
    status: 'waiting',
    title: '레미제라블',
    date: '2024-12-05',
    place: '세종문화회관',
    ticketDetails: {
      performanceName: '레미제라블',
      reservationImage: image, // 예매내역서 사진
      seatImage: image, // 좌석 사진
      location: '세종문화회관',
      ticketingPlatform: '인터파크',
      performanceDate: '2024-12-05',
      performanceTime: '19:00',
      reservationNumber: '123456',
      seatInfo: '1층 A열 5번',
      castingInfo: '홍길동, 김철수, 이영희',
      originalPrice: '100000',
      discountInfo: '10%',
      buyerPhoneLastDigits: '1234'
    }
  },
  {
    id: 2,
    status: 'transfer_intent',
    title: '햄릿',
    date: '2024-11-20',
    place: '예술의전당',
    ticketDetails: {
      performanceName: '햄릿',
      reservationImage: image,
      seatImage: image,
      location: '예술의전당',
      ticketingPlatform: 'YES24',
      performanceDate: '2024-11-20',
      performanceTime: '15:00',
      reservationNumber: '654321',
      seatInfo: '2층 B열 10번',
      castingInfo: '박수현, 최민수',
      originalPrice: '80000',
      discountInfo: '5%',
      buyerPhoneLastDigits: '5678'
    }
  },
  {
    id: 3,
    status: 'transfer_payment',
    title: '레미제라블',
    date: '2024-12-05',
    place: '세종문화회관',
    ticketDetails: {
      performanceName: '레미제라블',
      reservationImage: image, // 예매내역서 사진
      seatImage: image, // 좌석 사진
      location: '세종문화회관',
      ticketingPlatform: '인터파크',
      performanceDate: '2024-12-05',
      performanceTime: '19:00',
      reservationNumber: '123456',
      seatInfo: '1층 A열 5번',
      castingInfo: '홍길동, 김철수, 이영희',
      originalPrice: '100000',
      discountInfo: '10%',
      buyerPhoneLastDigits: '1234'
    }
  },
  {
    id: 4,
    status: 'transfer_complete',
    title: '햄릿',
    date: '2024-11-20',
    place: '예술의전당',
    ticketDetails: {
      performanceName: '햄릿',
      reservationImage: image,
      seatImage: image,
      location: '예술의전당',
      ticketingPlatform: 'YES24',
      performanceDate: '2024-11-20',
      performanceTime: '15:00',
      reservationNumber: '654321',
      seatInfo: '2층 B열 10번',
      castingInfo: '박수현, 최민수',
      originalPrice: '80000',
      discountInfo: '5%',
      buyerPhoneLastDigits: '5678'
    }
  },
  {
    id: 5,
    status: 'waiting',
    title: '레미제라블',
    date: '2024-12-05',
    place: '세종문화회관',
    ticketDetails: {
      performanceName: '레미제라블',
      reservationImage: image, // 예매내역서 사진
      seatImage: image, // 좌석 사진
      location: '세종문화회관',
      ticketingPlatform: '인터파크',
      performanceDate: '2024-12-05',
      performanceTime: '19:00',
      reservationNumber: '123456',
      seatInfo: '1층 A열 5번',
      castingInfo: '홍길동, 김철수, 이영희',
      originalPrice: '100000',
      discountInfo: '10%',
      buyerPhoneLastDigits: '1234'
    }
  },
  {
    id: 6,
    status: 'transfer_complete',
    title: '햄릿',
    date: '2024-11-20',
    place: '예술의전당',
    ticketDetails: {
      performanceName: '햄릿',
      reservationImage: image,
      seatImage: image,
      location: '예술의전당',
      ticketingPlatform: 'YES24',
      performanceDate: '2024-11-20',
      performanceTime: '15:00',
      reservationNumber: '654321',
      seatInfo: '2층 B열 10번',
      castingInfo: '박수현, 최민수',
      originalPrice: '80000',
      discountInfo: '5%',
      buyerPhoneLastDigits: '5678'
    }
  },
];
