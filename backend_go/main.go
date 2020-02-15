package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type SumRequest struct {
	NumberList string `json:"numberList"`
}

type CheckPrimeRequest struct {
	Candidate string `json:"primeCandidate"`
}

type Response struct {
	Success   bool   `json:"success"`
	IsPrime   bool   `json:"isPrime"`
	ErrorText string `json:"err"`
	Sum       int64  `json:"sum,omitempty"`
}

func checkPrime(num int64) Response {
	if num < 2 {
		return Response{Success: false, IsPrime: false, ErrorText: "Number smaller than 2"}
	}

	var i int64
	for i = 2; i < num; i++ {
		if num%i == 0 {
			break
		}
	}

	if i == num {
		return Response{Success: true, IsPrime: true}
	} else {
		return Response{Success: true, IsPrime: false, ErrorText: fmt.Sprintf("Number has a divisor of %d", i)}
	}
}

func convertToInt64(jsonList string) ([]int64, error) {
	var list []int64
	numbers := strings.Split(jsonList, ",")
	log.Printf("convertToInt64: %v", numbers)
	for _, val := range numbers {
		num, err := strconv.ParseInt(val, 10, 64)
		if err != nil {
			return []int64{}, fmt.Errorf("Conversion of %v to a number failed, err=%s", val, err.Error())
		}
		list = append(list, num)
	}
	return list, nil
}

func add(numberList []int64) int64 {
	var sum int64
	for _, val := range numberList {
		sum = sum + val
	}

	return sum
}

func main() {
	router := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}

	router.Use(cors.New(config))

	router.POST("/api/sum", func(c *gin.Context) {
		var sumRequest SumRequest
		if err := c.ShouldBindJSON(&sumRequest); err != nil {
			log.Printf("%s Error: %s", c.Request.RequestURI, err.Error())
			resp := Response{Success: false, IsPrime: false, ErrorText: err.Error()}
			c.JSON(200, resp)
			return
		}

		numberList, err := convertToInt64(sumRequest.NumberList)
		if err != nil {
			log.Printf("%s Error: %s", c.Request.RequestURI, err.Error())
			resp := Response{Success: false, IsPrime: false, ErrorText: err.Error()}
			c.JSON(200, resp)
			return
		}

		sum := add(numberList)
		response := checkPrime(sum)
		response.Sum = sum
		c.JSON(200, response)
	})

	router.POST("/api/isprime", func(c *gin.Context) {
		var request CheckPrimeRequest
		if err := c.ShouldBindJSON(&request); err != nil {
			log.Printf("%s Error: %s", c.Request.RequestURI, err.Error())
			resp := Response{Success: false, IsPrime: false, ErrorText: err.Error()}
			c.JSON(http.StatusBadRequest, resp)
			return
		}

		candidate, err := strconv.ParseInt(request.Candidate, 10, 64)
		if err != nil {
			errtext := fmt.Sprintf("Conversion of %v to a number faile, err=%s", request.Candidate, err)
			resp := Response{Success: false, IsPrime: false, ErrorText: errtext}
			c.JSON(http.StatusBadRequest, resp)
			return
		}

		response := checkPrime(candidate)
		c.JSON(http.StatusOK, response)
	})

	router.Run(":3002")

}
